from django.views.generic import TemplateView
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from mix_match.models import Mix_match,Mix_match_child
from mix_match import mix_match_getter,mix_match_serializer
import json
from store_product.models import Store_product
from util import boolean 

def get_view(request):
    cur_login_store = request.session.get('cur_login_store')
    mix_match_lst = mix_match_getter.get_mix_match_lst(cur_login_store.id)
    mix_match_serialized_lst = mix_match_serializer.serialize_mix_match_lst(mix_match_lst)    
    return HttpResponse(json.dumps(mix_match_serialized_lst,cls=DjangoJSONEncoder), mimetype='application/json')  

def mix_match_update_view(request):
    cur_login_store = request.session.get('cur_login_store')
    id = request.POST['id'] 
    name = request.POST['name'] 
    qty = request.POST['qty'] 
    mm_price = request.POST['mm_price'] 
    is_include_crv_tax = boolean.get_boolean_from_str(request.POST['is_include_crv_tax'])
    mix_match_child_pid_lst = request.POST['pid_comma_separated_lst_str'].split(",")

    #validate child is not emtpy
    if len(mix_match_child_pid_lst) == 0:
        return

    #validate parent id 
    parent = mix_match_getter.get_mix_match_item(id=id)
    if parent.store.id != cur_login_store.id:
        return

    #validate child belong store product of this store
    sp_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=mix_match_child_pid_lst)
    if len(sp_lst) != len(mix_match_child_pid_lst):
        return

    #update parent
    parent.name = name
    parent.qty = qty
    parent.mm_price = mm_price
    parent.is_include_crv_tax = is_include_crv_tax
    parent.save()

    #update child
    parent.mix_match_child_set.all().delete()
    child_lst = []
    for sp in sp_lst:
        child_lst.append(Mix_match_child(parent_id=parent.id,store_product_id=sp.id))

    Mix_match_child.objects.bulk_create(child_lst)

    #response
    parent = mix_match_getter.get_mix_match_item(id=parent.id)
    parent_serialized = mix_match_serializer.serialize_mix_match_lst([parent,])[0]

    return HttpResponse(json.dumps(parent_serialized,cls=DjangoJSONEncoder), mimetype='application/json')  

def mix_match_update_angular_view(request):
    cur_login_store = request.session.get('cur_login_store')

    mm = json.loads(request.POST['mix_match'])

    # id = request.POST['id'] 
    # name = request.POST['name'] 
    # qty = request.POST['qty'] 
    # mm_price = request.POST['mm_price'] 
    # is_include_crv_tax = boolean.get_boolean_from_str(request.POST['is_include_crv_tax'])
    # mix_match_child_pid_lst = request.POST['pid_comma_separated_lst_str'].split(",")

    #validate child is not emtpy
    if len(mm['mix_match_child_set']) == 0:
        return

    #validate parent id 
    parent = mix_match_getter.get_mix_match_item(id=mm['id'])
    if parent.store.id != cur_login_store.id:
        return

    #validate child belong store product of this store
    sp_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=[child['store_product']['product_id'] for child in mm['mix_match_child_set']])
    if len(sp_lst) != len(mm['mix_match_child_set']):
        return

    #update parent
    parent.name = mm['name']
    parent.qty = mm['qty']
    parent.mm_price = mm['mm_price']
    parent.is_include_crv_tax = mm['is_include_crv_tax']
    parent.save()

    #update child
    parent.mix_match_child_set.all().delete()
    child_lst = []
    for sp in sp_lst:
        child_lst.append(Mix_match_child(parent_id=parent.id,store_product_id=sp.id))

    Mix_match_child.objects.bulk_create(child_lst)

    #response
    parent = mix_match_getter.get_mix_match_item(id=parent.id)
    parent_serialized = mix_match_serializer.serialize_mix_match_lst([parent,])[0]

    return HttpResponse(json.dumps(parent_serialized,cls=DjangoJSONEncoder), mimetype='application/json')  


def mix_match_insert_view(request):
    cur_login_store = request.session.get('cur_login_store')
    name = request.POST['name'] 
    qty = request.POST['qty'] 
    mm_price = request.POST['mm_price'] 
    is_include_crv_tax = boolean.get_boolean_from_str(request.POST['is_include_crv_tax'])
    mix_match_child_pid_lst = request.POST['pid_comma_separated_lst_str'].split(",")

    #validate child is not emtpy
    if len(mix_match_child_pid_lst) == 0:
        return

    #validate child belong store product of this store
    sp_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=mix_match_child_pid_lst)
    if len(sp_lst) != len(mix_match_child_pid_lst):
        return

    #create parent
    parent = Mix_match.objects.create(store_id=cur_login_store.id,name=name,qty=qty,mm_price=mm_price,is_include_crv_tax=is_include_crv_tax)
    
    #create child
    child_lst = []
    for sp in sp_lst:
        child_lst.append(Mix_match_child(parent_id=parent.id,store_product_id=sp.id))
    Mix_match_child.objects.bulk_create(child_lst)

    #response
    parent = mix_match_getter.get_mix_match_item(id=parent.id)
    parent_serialized = mix_match_serializer.serialize_mix_match_lst([parent,])[0]

    return HttpResponse(json.dumps(parent_serialized,cls=DjangoJSONEncoder), mimetype='application/json')    

def mix_match_insert_angular_view(request):
    cur_login_store = request.session.get('cur_login_store')
    mix_match = json.loads(request.POST['mix_match'])

    #validate child is not emtpy
    if len(mix_match['mix_match_child_set']) == 0:
        return

    #validate child belong store product of this store
    sp_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=[ child['store_product']['product_id'] for child in mix_match['mix_match_child_set']])
    if len(sp_lst) != len(mix_match['mix_match_child_set']):
        return

    #create parent
    parent = Mix_match.objects.create(store_id=cur_login_store.id,name=mix_match['name'],qty=mix_match['qty'],mm_price=mix_match['mm_price'],is_include_crv_tax=mix_match['is_include_crv_tax'])
    
    #create child
    child_lst = []
    for sp in sp_lst:
        child_lst.append(Mix_match_child(parent_id=parent.id,store_product_id=sp.id))
    Mix_match_child.objects.bulk_create(child_lst)

    #response
    parent = mix_match_getter.get_mix_match_item(id=parent.id)
    parent_serialized = mix_match_serializer.serialize_mix_match_lst([parent,])[0]

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
    mix_match_serialized_lst = mix_match_serializer.serialize_mix_match_lst(mix_match_lst)
    return HttpResponse(json.dumps(mix_match_serialized_lst,cls=DjangoJSONEncoder), mimetype='application/json')

