from django.http import HttpResponse
import datetime
from django.core.serializers.json import DjangoJSONEncoder
import json
from receipt.receipt_serializer import Receipt_serializer
from django.core.paginator import Paginator
from receipt.models import Receipt,Receipt_ln,Tender_ln
from receipt import dao

def exe(request):
    cur_login_store = request.session.get('cur_login_store')
    id = request.POST['id']
    param_tender_ln_lst = json.loads(request.POST['tender_ln_lst'])

    #validate that this receipt belong to this store
    receipt = dao.get_item(id=id)
    if receipt.store.id != cur_login_store.id:
        return

    #modify
    receipt.tender_ln_lst.all().delete()
    _2_create_tender_ln_lst = []
    for item in param_tender_ln_lst:
        if item['amount'] != None:
            _2_create_tender_ln_lst.append(
                Tender_ln(
                     receipt_id = receipt.id
                    ,payment_type_id = item['pt']['id'] if item['pt'] != None else None
                    ,amount = item['amount']
                    ,name = item['name']
                )
            )
    Tender_ln.objects.bulk_create(_2_create_tender_ln_lst)

    #response
    receipt = dao.get_item(id)
    receipt_serialized = Receipt_serializer(receipt).data
    return HttpResponse(json.dumps(receipt_serialized,cls=DjangoJSONEncoder),mimetype='application/javascript')
