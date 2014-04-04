from store_product import sp_serializer
from sp_master_util import get_sp,get_lookup_type_tag
from django.http import HttpResponse
import json

def sp_getter_ajax_view(request):
    if request.method == 'GET':
        if request.GET.has_key('product_id'):
            store_id = request.session.get('cur_login_store').id
            product_id = request.GET['product_id']
            sp_raw = get_sp(store_id = store_id,product_id = product_id)
            sp_serialized = sp_serializer.Store_product_serializer([sp_raw,]).data[0]
            print(sp_serialized)
            lookup_type_tag = get_lookup_type_tag(store_id)
            return HttpResponse(json.dumps({'sp':sp_serialized,'lookup_type_tag':lookup_type_tag}),content_type='application/json')
