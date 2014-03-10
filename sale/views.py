from django.views.generic import TemplateView
from django.conf import settings
from product.models import ProdSkuAssoc
from util.couch import user_util
from store.couch import store_util
from django.http import HttpResponse
import json
from sale import sale_processor
from sale.models import Receipt
import datetime
from django.core.serializers.json import DjangoJSONEncoder

class Sale_view(TemplateView):
    template_name = 'sale/index.html'

    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(Sale_view,self).dispatch(request,*args,**kwargs)

    def get_context_data(self,**kwargs):
        context = super(Sale_view,self).get_context_data(**kwargs)
        bus_id = str(self.cur_login_store.id)
        client_user_name = user_util.get_client_user_name(bus_id)
        client_user_password = user_util.get_client_user_password(bus_id)
        couch_server_url = 'http://' + client_user_name + ':' +client_user_password + "@" + settings.COUCHDB_URL
        store_db_name = store_util.get_store_db_name(bus_id)

        context['store_db_name'] = store_db_name
        context['couch_server_url'] = couch_server_url
        context['ROW_COUNT'] = 5
        context['COLUMN_COUNT'] = 3
        return context


class Sale_report_by_day(TemplateView):
    template_name = 'sale/report_by_day.html'

    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(Sale_report_by_day,self).dispatch(request,*args,**kwargs)


def get_report_by_day_view(request):
    if request.POST.has_key('from_day') and request.POST.has_key('to_day'):
        cur_login_store = request.session.get('cur_login_store')

        from_day_str = request.POST['from_day']
        to_day_str = request.POST['to_day']
        from_day = None
        to_day = None
        receipt_lst = None
        errmsg = None

        try:
            from_day = datetime.datetime.strptime(from_day_str, '%m/%d/%Y')
            to_day = datetime.datetime.strptime(to_day_str, '%m/%d/%Y')
            to_day += datetime.timedelta(days=1)
            print(from_day)
            print(to_day)
            print(Receipt.objects.filter(store_id=cur_login_store.id,time_stamp__range=(from_day, to_day)).prefetch_related('receipt_ln_lst').query)
            receipt_lst = list(Receipt.objects.filter(store_id=cur_login_store.id,time_stamp__range=(from_day, to_day)).prefetch_related('receipt_ln_lst'))
        except ValueError:
            errmsg = "Incorrect data format, should be MM-DD-YYYY"

        if receipt_lst != None:
            return HttpResponse(json.dumps(sale_data_2_json(receipt_lst),cls=DjangoJSONEncoder),mimetype='application/javascript')
        else:
            return HttpResponse(json.dumps({'error':errmsg}),mimetype='application/javascript')


def update_dic(key,amount,dic):
    if key in dic:
        dic[key] += amount
    else:
        dic[key] = amount


def sale_data_2_json(receipt_lst):
    dic = {}

    receipt_ln_lst = []
    for receipt in receipt_lst:
        receipt_ln_lst += receipt.receipt_ln_lst.all()

    for item in receipt_ln_lst:
        amount = item.get_total_out_the_door_price()
        
        if item.store_product != None and item.store_product.isSaleReport:
            #TAX - NON_TAX
            key = 'tax' if item.store_product.isTaxable else 'non_tax'
            update_dic(key,amount,dic)

            if item.store_product.department != None:
                update_dic(item.store_product.department.category.name,amount,dic)

        elif item.store_product == None:
            update_dic(item.non_product_name,amount,dic)

    return dic
    

def process_sale_data_view(request):
    if request.POST.has_key('store_db_name'):
        store_db_name = request.POST['store_db_name']   
        cur_login_store = request.session.get('cur_login_store')
        
        response_dict = {}
        response_message = None
        if store_util.get_store_db_name(cur_login_store.id) == store_db_name :
            receipt_processed_count = sale_processor.exe(cur_login_store.id) 
            response_message = str(receipt_processed_count) + ' receipt(s) processed.'
        else:
            response_message = 'error in specify store number. Got cha!'
        
        response_dict.update({'server_response': 'from server ' + response_message })                              
        return HttpResponse(json.dumps(response_dict), mimetype='application/javascript')
          

    

