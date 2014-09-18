from store_product import sp_serializer,store_product_master_getter
from store_product.models import Store_product
from store_product.cm import sp_kit_update_angular_cm
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

