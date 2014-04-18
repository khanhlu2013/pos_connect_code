from django.views.generic import TemplateView
from couch import couch_util
from django.http import HttpResponse
import json
import datetime
from django.core.serializers.json import DjangoJSONEncoder
from sale import report_getter

class Sale_view(TemplateView):
    template_name = 'sale/index.html'

    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(Sale_view,self).dispatch(request,*args,**kwargs)

    def get_context_data(self,**kwargs):
        context = super(Sale_view,self).get_context_data(**kwargs)
        store_id = str(self.cur_login_store.id)
        context['store_id'] = store_id
        context['couch_server_url'] = couch_util.get_couch_url(self.cur_login_store.api_key_name,self.cur_login_store.api_key_pwrd)
        context['ROW_COUNT'] = 5        # xxx move this ugly to constance
        context['COLUMN_COUNT'] = 3     # xxx move this ugly to constance
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
        report_result_dic = None
        errmsg = None

        try:
            from_day = datetime.datetime.strptime(from_day_str, '%m/%d/%Y')
            to_day = datetime.datetime.strptime(to_day_str, '%m/%d/%Y')
            to_day += datetime.timedelta(days=1)
            report_result_dic = report_getter.exe(store_id= cur_login_store.id,from_date=from_day,to_date=to_day)

        except ValueError:
            errmsg = "Incorrect data format, should be MM-DD-YYYY"

        if report_result_dic != None:
            return HttpResponse(json.dumps(report_result_dic,cls=DjangoJSONEncoder),mimetype='application/javascript')
        else:
            return HttpResponse(json.dumps({'error':errmsg}),mimetype='application/javascript')


   

