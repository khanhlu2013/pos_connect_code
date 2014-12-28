from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from group.models import Group
from group.group_serializer import Group_serializer
import json
from store_product.models import Store_product

def group_insert_angular_view(request):
    cur_login_store = request.session.get('cur_login_store')
    group_json = json.loads(request.POST['group'])
    
    sp_lst = []
    count_sp_client = len(group_json['sp_lst'])
    if count_sp_client != 0:
        sp_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=[sp['product_id'] for sp in group_json['sp_lst']])
        if count_sp_client != len(sp_lst):
            return

    #create group
    group = Group.objects.create(store_id=cur_login_store.id,name=group_json['name'])
    
    #insert sp
    if len(sp_lst) !=0:
        group.sp_lst.add(*sp_lst)

    #response
    group_serialized = Group_serializer(group,many=False).data
    return HttpResponse(json.dumps(group_serialized,cls=DjangoJSONEncoder), mimetype='application/json')

