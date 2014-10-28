from django.http import HttpResponse
import datetime
from django.core.serializers.json import DjangoJSONEncoder
import json
from receipt.receipt_serializer import Receipt_serializer
from django.core.paginator import Paginator
from receipt.models import Receipt
from receipt import dao

def get_receipt_pagination(request):
    cur_login_store = request.session.get('cur_login_store')
    
    #get param
    cur_page = request.GET['cur_page']
    receipt_per_page = request.GET['receipt_per_page']
    from_date_str = request.GET['from_date']
    to_date_str = request.GET['to_date']
    time_zone_offset = int(request.GET['time_zone_offset'])

    from_date = datetime.datetime.strptime(from_date_str, '%m/%d/%Y')
    to_date = datetime.datetime.strptime(to_date_str, '%m/%d/%Y')
    to_date += datetime.timedelta(days=1)

    from_date += datetime.timedelta(hours = time_zone_offset)
    to_date += datetime.timedelta(hours = time_zone_offset)

    #get receipt data
    query = dao.get_lst(cur_login_store.id,from_date,to_date)
    paginator = Paginator(query,receipt_per_page)

    #response
    receipt_lst = paginator.page(cur_page)
    receipt_lst_serialized = Receipt_serializer(receipt_lst,many=True).data
    response = {'receipt_lst':receipt_lst_serialized,'total':paginator.count}

    return HttpResponse(json.dumps(response,cls=DjangoJSONEncoder),mimetype='application/javascript')
  
def get_receipt_by_count(request):
    cur_login_store = request.session.get('cur_login_store')
    
    #get param
    count = request.GET['count']

    #get receipt data
    receipt_lst = dao.get_lst_by_count(cur_login_store.id,count)
    receipt_lst_serialized = Receipt_serializer(receipt_lst,many=True).data

    return HttpResponse(json.dumps(receipt_lst_serialized,cls=DjangoJSONEncoder),mimetype='application/javascript')

def get_receipt_by_range(request):
    cur_login_store = request.session.get('cur_login_store')
    
    #get param
    from_date_str = request.GET['from_date']
    to_date_str = request.GET['to_date']
    time_zone_offset = int(request.GET['time_zone_offset'])

    from_date = datetime.datetime.strptime(from_date_str, '%m/%d/%Y')
    to_date = datetime.datetime.strptime(to_date_str, '%m/%d/%Y')
    to_date += datetime.timedelta(days=1)

    from_date += datetime.timedelta(hours = time_zone_offset)
    to_date += datetime.timedelta(hours = time_zone_offset)

    #get receipt data
    receipt_lst = dao.get_lst(cur_login_store.id,from_date,to_date)
    receipt_lst_serialized = Receipt_serializer(receipt_lst,many=True).data

    return HttpResponse(json.dumps(receipt_lst_serialized,cls=DjangoJSONEncoder),mimetype='application/javascript')