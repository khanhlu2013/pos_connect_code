from django.views.generic import TemplateView
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from mix_match.models import Mix_match
from mix_match import mix_match_getter
from mix_match.mix_match_serializer import Mix_match_serializer
import json
from store_product.models import Store_product


def get_view(request):
    cur_login_store = request.session.get('cur_login_store')
    mix_match_lst = mix_match_getter.get_mix_match_lst(cur_login_store.id)
    mix_match_serialized_lst = Mix_match_serializer(mix_match_lst,many=True).data 
    return HttpResponse(json.dumps(mix_match_serialized_lst,cls=DjangoJSONEncoder), mimetype='application/json')  

def mix_match_update_angular_view(request):
    cur_login_store = request.session.get('cur_login_store')

    mm = json.loads(request.POST['mix_match'])

    #validate child is not emtpy
    if len(mm['sp_lst']) == 0:
        return

    #validate parent id 
    parent = mix_match_getter.get_mix_match_item(id=mm['id'])
    if parent.store.id != cur_login_store.id:
        return

    #validate child belong store product of this store
    sp_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=[sp['product_id'] for sp in mm['sp_lst']])
    if len(sp_lst) != len(mm['sp_lst']):
        return

    #update parent
    parent.name = mm['name']
    parent.qty = mm['qty']
    parent.mm_price = mm['mm_price']
    parent.is_include_crv_tax = mm['is_include_crv_tax']
    parent.save()

    #update child
    parent.sp_lst.clear();
    parent.sp_lst.add(*sp_lst);

    #response
    parent = mix_match_getter.get_mix_match_item(id=parent.id)
    parent_serialized = Mix_match_serializer(parent).data

    return HttpResponse(json.dumps(parent_serialized,cls=DjangoJSONEncoder), mimetype='application/json')  

def mix_match_insert_angular_view(request):
    cur_login_store = request.session.get('cur_login_store')
    mix_match = json.loads(request.POST['mix_match'])

    #validate child is not emtpy
    if len(mix_match['sp_lst']) == 0:
        return

    #validate child belong store product of this store
    sp_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=[ child['product_id'] for child in mix_match['sp_lst']])
    if len(sp_lst) != len(mix_match['sp_lst']):
        return

    #create 
    parent = Mix_match.objects.create(store_id=cur_login_store.id,name=mix_match['name'],qty=mix_match['qty'],mm_price=mix_match['mm_price'],is_include_crv_tax=mix_match['is_include_crv_tax'])
    parent.sp_lst.add(*sp_lst)

    #response
    parent = mix_match_getter.get_mix_match_item(id=parent.id)
    parent_serialized = Mix_match_serializer(parent).data;

    return HttpResponse(json.dumps(parent_serialized,cls=DjangoJSONEncoder), mimetype='application/json')    

def mix_match_delete_view(request):
    cur_login_store = request.session.get('cur_login_store')
    id = request.POST['id'] 
    
    #validate parent id 
    parent = mix_match_getter.get_mix_match_item(id=id)
    if parent.store.id != cur_login_store.id:
        return

    parent.delete();
    mix_match_lst = mix_match_getter.get_mix_match_lst(cur_login_store.id)
    mix_match_serialized_lst = Mix_match_serializer(mix_match_lst,many=True).data
    return HttpResponse(json.dumps(mix_match_serialized_lst,cls=DjangoJSONEncoder), mimetype='application/json')

