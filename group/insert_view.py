from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from group.models import Group,serialize_group_lst
from group import group_getter
import json
from store_product.models import Store_product

def group_insert_view(request):
    cur_login_store = request.session.get('cur_login_store')
    pid_comma_separated_lst_str = request.POST['pid_comma_separated_lst_str']
    name = request.POST['name']
    
    pid_lst = []
    if len(pid_comma_separated_lst_str) != 0:
        pid_lst = pid_comma_separated_lst_str.split(",")     

    sp_lst = []
    if len(pid_lst) != 0:
        sp_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=pid_lst)

    #validate child belong store product of this store        
    if len(sp_lst) != len(pid_lst):
        return

    #create group
    group = Group.objects.create(store_id=cur_login_store.id,name=name)
    
    #insert sp
    if len(sp_lst) !=0:
        group.store_product_set.add(*sp_lst)

    #response
    group_serialized = serialize_group_lst([group,])[0]
    return HttpResponse(json.dumps(group_serialized,cls=DjangoJSONEncoder), mimetype='application/json')