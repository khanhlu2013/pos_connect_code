from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from group.models import Group
from group.group_serializer import serialize_group_lst
from group import group_getter
import json
from store_product.models import Store_product

def group_update_angular_view(request):
    cur_login_store = request.session.get('cur_login_store')
    id = request.POST['id'] 
    group_json = json.loads(request.POST['group'])


    sp_lst = []
    if len(group_json['sp_lst']) != 0:
        sp_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=[sp['product_id'] for sp in group_json['sp_lst']])

    #validate child belong store product of this store        
    if len(sp_lst) != len(group_json['sp_lst']):
        return


    #validate group id 
    group = group_getter.get_group_item(id=id,store_id=cur_login_store.id)
    if group.store.id != cur_login_store.id:
        return

    #update group
    group.name = group_json['name']
    group.save()

    #remove and add sp
    group.store_product_set.clear()
    if len(sp_lst) !=0:
        group.store_product_set.add(*sp_lst)

    #response
    group = group_getter.get_group_item(id=id,store_id=cur_login_store.id)
    group_serialized = serialize_group_lst([group,])[0]
    return HttpResponse(json.dumps(group_serialized,cls=DjangoJSONEncoder), mimetype='application/json')


def group_update_view(request):
    cur_login_store = request.session.get('cur_login_store')
    id = request.POST['id'] 
    name = request.POST['name'] 
    pid_comma_separated_lst_str = request.POST['pid_comma_separated_lst_str']


    pid_lst = []
    if len(pid_comma_separated_lst_str) != 0:
        pid_lst = pid_comma_separated_lst_str.split(",") 

    sp_lst = []
    if len(pid_lst) != 0:
        sp_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=pid_lst)

    #validate child belong store product of this store        
    if len(sp_lst) != len(pid_lst):
        return


    #validate group id 
    group = group_getter.get_group_item(id=id,store_id=cur_login_store.id)
    if group.store.id != cur_login_store.id:
        return

    #update group
    group.name = name
    group.save()

    #remove and add sp
    group.store_product_set.clear()
    if len(sp_lst) !=0:
        group.store_product_set.add(*sp_lst)

    #response
    group = group_getter.get_group_item(id=id,store_id=cur_login_store.id)
    group_serialized = serialize_group_lst([group,])[0]
    return HttpResponse(json.dumps(group_serialized,cls=DjangoJSONEncoder), mimetype='application/json')