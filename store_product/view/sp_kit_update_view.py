from store_product import sp_updator,sp_serializer,store_product_master_getter,sp_kit_update_cm
from store_product.models import Store_product
from django.http import HttpResponse
import json
from django.core.serializers.json import DjangoJSONEncoder

def sp_kit_update_view(request):
    """
        client: post 2 params:
            . kit_id: a product_id of kit
            . breakdown_assoc_lst: a list of {breakdown_id,qty}
    """
    #init
    if request.method != 'POST':
        return
    data=json.loads(request.body)
    kit_id = data['kit_id']
    breakdown_assoc_lst = data['breakdown_assoc_lst']
    cur_login_store = request.session.get('cur_login_store')

    #update
    product_serialized = sp_kit_update_cm.exe(kit_id=kit_id,store_id=cur_login_store.id,breakdown_assoc_lst=breakdown_assoc_lst)

    #response
    return HttpResponse(json.dumps(product_serialized,cls=DjangoJSONEncoder),content_type='application/json')