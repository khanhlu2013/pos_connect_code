from payment_type.models import Payment_type
from payment_type.payment_type_serializer import Payment_type_serializer
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
import json


def payment_type_insert_view(request):
    pt = json.loads(request.POST['pt'])
    cur_login_store = request.session.get('cur_login_store')
    pt = Payment_type.objects.create(name=pt['name'],sort=pt['sort'],store_id=cur_login_store.id,active=pt['active'])
    pt_serialized = Payment_type_serializer(pt).data
    return HttpResponse(json.dumps(pt_serialized,cls=DjangoJSONEncoder), mimetype='application/json')

def payment_type_update_angular_view(request):
    pt_json = json.loads(request.POST['pt'])

    cur_login_store = request.session.get('cur_login_store')
    pt = Payment_type.objects.get(pk=pt_json['id'],store_id = cur_login_store.id)
    pt.name = pt_json['name']
    pt.sort = pt_json['sort']
    pt.active = pt_json['active']
    pt.save()

    pt_serialized = Payment_type_serializer(pt).data
    return HttpResponse(json.dumps(pt_serialized,cls=DjangoJSONEncoder), mimetype='application/json')

def payment_type_delete_view(request):
    id = request.POST['id'] 
    cur_login_store = request.session.get('cur_login_store')
    pt = Payment_type.objects.get(pk=id,store_id=cur_login_store.id);
    pt.delete();
    pt_lst = Payment_type.objects.filter(store_id=cur_login_store.id)
    pt_lst_serialized = Payment_type_serializer(pt_lst,many=True).data
    return HttpResponse(json.dumps(pt_lst_serialized,cls=DjangoJSONEncoder), mimetype='application/json')


def payment_type_get_view(request):
    cur_login_store = request.session.get('cur_login_store')
    pt_lst = Payment_type.objects.filter(store_id=cur_login_store.id)
    pt_lst_serialized = Payment_type_serializer(pt_lst,many=True).data
    return HttpResponse(json.dumps(pt_lst_serialized,cls=DjangoJSONEncoder), mimetype='application/json')
