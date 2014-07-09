from django.http import HttpResponse
import datetime
from django.core.serializers.json import DjangoJSONEncoder
import json
from receipt import receipt_getter
from receipt.receipt_serializer import serialize_receipt_lst

def get_receipt_view(request):
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
    receipt_lst = receipt_getter.exe(cur_login_store.id,from_date,to_date)
    receipt_serialized_lst = serialize_receipt_lst(receipt_lst)


    return HttpResponse(json.dumps(receipt_serialized_lst,cls=DjangoJSONEncoder),mimetype='application/javascript')
        