from store_product import sp_serializer,store_product_master_getter,sp_kit_update_cm,sp_kit_update_angular_cm
from store_product.models import Store_product
from django.http import HttpResponse
import json
from django.core.serializers.json import DjangoJSONEncoder


def sp_kit_update_angular_view(request):
    sp = json.loads(request.POST['sp'])
    cur_login_store = request.session.get('cur_login_store')

    #verify kit belong to this store
    kit = Store_product.objects.get(product_id=sp['product_id'],store_id=cur_login_store.id)

    #verify kit breakdown belong to this store
    if len(sp['breakdown_assoc_lst']) > 0:
        breakdown_assoc_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=[assoc['breakdown']['product_id'] for assoc in sp['breakdown_assoc_lst']])
        if len(breakdown_assoc_lst) != len(sp['breakdown_assoc_lst']):
            return
            
    sp = sp_kit_update_angular_cm.exe(kit=kit,breakdown_assoc_lst=sp['breakdown_assoc_lst'])
    sp_serialized = sp_serializer.Store_product_serializer(sp).data
    return HttpResponse(json.dumps(sp_serialized,cls=DjangoJSONEncoder),content_type='application/json')    


def sp_kit_update_view(request):
    """
        client: post 2 params:
            . kit_id: a product_id of kit
            . breakdown_assoc_lst: a list of {breakdown_id,qty}
            . TODO i think i need to change from breakdown_id to breakdown_pid, kit_id to kit_pid
    """
    #init
    if request.method != 'POST':
        return
    data=json.loads(request.body)
    kit_id = data['kit_id']
    breakdown_assoc_lst = data['breakdown_assoc_lst']
    cur_login_store = request.session.get('cur_login_store')

    #update
    product_serialized = sp_kit_update_cm.exe(kit_id=kit_id,store_id=cur_login_store.id,assoc_json_lst=breakdown_assoc_lst)

    #response
    return HttpResponse(json.dumps(product_serialized,cls=DjangoJSONEncoder),content_type='application/json')