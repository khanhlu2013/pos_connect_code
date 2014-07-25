from django.http import HttpResponse
import datetime
from django.core.serializers.json import DjangoJSONEncoder
import json
from receipt.receipt_serializer import Receipt_serializer
from django.core.paginator import Paginator
from receipt.models import Receipt
from receipt import copy_receipt_from_couch_2_master

def get_receipt_view(request):
    cur_login_store = request.session.get('cur_login_store')
    
    #get param
    cur_page = request.GET['cur_page']
    from_date_str = request.GET['from_date']
    to_date_str = request.GET['to_date']
    time_zone_offset = int(request.GET['time_zone_offset'])

    from_date = datetime.datetime.strptime(from_date_str, '%m/%d/%Y')
    to_date = datetime.datetime.strptime(to_date_str, '%m/%d/%Y')
    to_date += datetime.timedelta(days=1)

    from_date += datetime.timedelta(hours = time_zone_offset)
    to_date += datetime.timedelta(hours = time_zone_offset)

    copy_receipt_from_couch_2_master.exe(cur_login_store.id)

    #get receipt data
    RECEIPT_PER_PAGE_AKA_COUNT = 2
    query = Receipt.objects.filter(store=cur_login_store,time_stamp__range=(from_date,to_date)).prefetch_related('receipt_ln_set')
    paginator = Paginator(query,RECEIPT_PER_PAGE_AKA_COUNT)

    #response
    receipt_lst = paginator.page(cur_page)
    receipt_lst_serialized = Receipt_serializer(receipt_lst,many=True).data
    response = {'receipt_lst':receipt_lst_serialized,'total':paginator.count}

    return HttpResponse(json.dumps(response,cls=DjangoJSONEncoder),mimetype='application/javascript')
  

