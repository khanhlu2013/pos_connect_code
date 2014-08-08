from group.models import Group
from store_product import store_product_master_getter,sp_serializer
from django.http import HttpResponse
import json
from django.core.serializers.json import DjangoJSONEncoder


def sp_group_update_angular_view(request):
    cur_login_store = request.session.get('cur_login_store')
    sp_json = json.loads(request.POST['sp']) 

    #validate sp belong to the store
    sp = store_product_master_getter.get_item(product_id=sp_json['product_id'],store_id=cur_login_store.id)

    #validate group belong to store
    group_lst = []
    if len(sp_json['group_lst']) >0:
        group_lst = Group.objects.filter(store_id=cur_login_store.id,pk__in=[group['id'] for group in sp_json['group_lst']])
        if len(group_lst) != len(sp_json['group_lst']):
            return

    #remove all group from sp
    sp.group_set.clear()

    #add group
    if len(group_lst) != 0:
        sp.group_set.add(*group_lst)

    product_serialized = sp_serializer.Store_product_serializer(sp).data   
    return HttpResponse(json.dumps(product_serialized,cls=DjangoJSONEncoder),content_type='application/json')    


def sp_group_update_view(request):
    cur_login_store = request.session.get('cur_login_store')
    product_id = request.POST['product_id'] 
    group_id_comma_separated_lst_str = request.POST['group_id_comma_separated_lst_str']
    
    group_id_lst = []
    if len(group_id_comma_separated_lst_str) != 0:
        group_id_lst = group_id_comma_separated_lst_str.split(",") 

    #validate sp belong to the store
    sp = store_product_master_getter.get_item(product_id=product_id,store_id=cur_login_store.id)

    #validate group belong to store
    group_lst = []
    if len(group_id_lst) !=0:
        group_lst = Group.objects.filter(store_id=cur_login_store.id,pk__in=group_id_lst)
        if len(group_lst) != len(group_id_lst):
            return

    #remove all group from sp
    sp.group_set.clear()

    #add group
    if len(group_lst) != 0:
        sp.group_set.add(*group_lst)

    product_serialized = sp_serializer.serialize_product_from_id(product_id=product_id,store_id = cur_login_store.id,is_include_other_store = False)     
    return HttpResponse(json.dumps(product_serialized,cls=DjangoJSONEncoder),content_type='application/json')    

