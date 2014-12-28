from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from group.group_serializer import Group_serializer
from group import dao
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
    group = dao.get_group_item(id=id,store_id=cur_login_store.id)
    if group.store.id != cur_login_store.id:
        return

    #update group
    group.name = group_json['name']
    group.save()

    #remove and add sp
    group.sp_lst.clear()
    if len(sp_lst) !=0:
        group.sp_lst.add(*sp_lst)

    #response
    group = dao.get_group_item(id=id,store_id=cur_login_store.id)
    group_serialized = Group_serializer(group,many=False).data
    return HttpResponse(json.dumps(group_serialized,cls=DjangoJSONEncoder), mimetype='application/json')

