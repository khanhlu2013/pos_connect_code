from payment_type.models import Payment_type
from payment_type import payment_type_serializer
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
import json


def payment_type_insert_view(request):
    name = request.POST['name'] 
    if name == None or len(name.strip()) == 0:
        return
    name = name.strip()
    cur_login_store = request.session.get('cur_login_store')

    pt = Payment_type.objects.create(name=name,store_id=cur_login_store.id)
    pt_serialized = payment_type_serializer.serialize_payment_type_lst([pt,])[0]
    return HttpResponse(json.dumps(pt_serialized,cls=DjangoJSONEncoder), mimetype='application/json')


def payment_type_update_view(request):
    id = request.POST['id'] 
    name = request.POST['name'] 

    if name == None or len(name.strip()) == 0:
        return
    name = name.strip()

    cur_login_store = request.session.get('cur_login_store')
    pt = Payment_type.objects.get(pk=id,store_id = cur_login_store.id)
    pt.name = name
    pt.save()

    pt_serialized = payment_type_serializer.serialize_payment_type_lst([pt,])[0]
    return HttpResponse(json.dumps(pt_serialized,cls=DjangoJSONEncoder), mimetype='application/json')


def payment_type_delete_view(request):
    id = request.POST['id'] 
    cur_login_store = request.session.get('cur_login_store')
    pt = Payment_type.objects.get(pk=id,store_id=cur_login_store.id);
    pt.delete();
    pt_lst = Payment_type.objects.filter(store_id=cur_login_store.id)
    pt_lst_serialized = payment_type_serializer.serialize_payment_type_lst(pt_lst)
    return HttpResponse(json.dumps(pt_lst_serialized,cls=DjangoJSONEncoder), mimetype='application/json')


def payment_type_get_view(request):
    cur_login_store = request.session.get('cur_login_store')
    pt_lst = Payment_type.objects.filter(store_id=cur_login_store.id)
    pt_lst_serialized = payment_type_serializer.serialize_payment_type_lst(pt_lst)
    return HttpResponse(json.dumps(pt_lst_serialized,cls=DjangoJSONEncoder), mimetype='application/json')


