from group.models import Group
from store_product import dao,sp_serializer
from django.http import HttpResponse
import json
from django.core.serializers.json import DjangoJSONEncoder


def exe(request):
    cur_login_store = request.session.get('cur_login_store')
    sp_json = json.loads(request.POST['sp']) 

    #validate sp belong to the store
    sp = dao.get_item(product_id=sp_json['product_id'],store_id=cur_login_store.id)

    #validate group belong to store
    group_lst = []
    if len(sp_json['group_lst']) >0:
        group_lst = Group.objects.filter(store_id=cur_login_store.id,pk__in=[group['id'] for group in sp_json['group_lst']])
        if len(group_lst) != len(sp_json['group_lst']):
            return

    #remove all group from sp
    sp.group_lst.clear()

    #add group
    if len(group_lst) != 0:
        sp.group_lst.add(*group_lst)

    product_serialized = sp_serializer.Store_product_serializer(sp).data   
    return HttpResponse(json.dumps(product_serialized,cls=DjangoJSONEncoder),content_type='application/json')    



