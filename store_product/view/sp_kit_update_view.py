from store_product import sp_serializer
from store_product.models import Store_product
from store_product.cm import sp_kit_update_angular_cm
from django.http import HttpResponse
import json
from django.core.serializers.json import DjangoJSONEncoder


def sp_kit_update_angular_view(request):
    cur_login_store = request.session.get('cur_login_store')
    sp_json = json.loads(request.POST['sp'])

    sp = sp_kit_update_angular_cm.exe(kit_product_id=sp_json['product_id'],breakdown_assoc_lst=sp_json['breakdown_assoc_lst'],store_id=cur_login_store.id)
    sp_serialized = sp_serializer.Store_product_serializer(sp).data
    return HttpResponse(json.dumps(sp_serialized,cls=DjangoJSONEncoder),content_type='application/json')    

