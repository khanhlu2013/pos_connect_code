from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from group.models import Group,Group_child,serialize_group_lst
from group import group_getter
import json
from store_product.models import Store_product

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


    #validate parent id 
    parent = group_getter.get_group_item(id=id)
    if parent.store.id != cur_login_store.id:
        return


    #update parent
    parent.name = name
    parent.save()

    #update child
    parent.group_child_set.all().delete()
    child_lst = []
    for sp in sp_lst:
        child_lst.append(Group_child(group_id=parent.id,store_product_id=sp.id))
    if len(child_lst) != 0:
        Group_child.objects.bulk_create(child_lst)

    #response
    parent = group_getter.get_group_item(id=parent.id)
    parent_serialized = serialize_group_lst([parent,])[0]

    return HttpResponse(json.dumps(parent_serialized,cls=DjangoJSONEncoder), mimetype='application/json') 