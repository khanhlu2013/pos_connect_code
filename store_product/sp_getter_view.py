from store_product import sp_serializer
from sp_master_util import get_lookup_type_tag
from django.http import HttpResponse
import json

def sp_getter_ajax_view(request):
    """
        lookup_type_tag can consider to be part of a product, for suggestion purpose. this is used in update sp. but for manage sku, we don't need this
    """
    if request.method == 'GET':
        if all(key in request.GET for key in ['product_id','is_include_other_store','is_include_lookup_type_tag']):
            store_id = request.session.get('cur_login_store').id
            product_id = request.GET['product_id']
            is_include_other_store = request.GET['is_include_other_store']
            is_include_lookup_type_tag = request.GET['is_include_lookup_type_tag']

            product_serialized = sp_serializer.serialize_product_from_id(
                 product_id = product_id
                ,store_id = store_id
                ,is_include_other_store = is_include_other_store
            )

            lookup_type_tag = None
            if is_include_lookup_type_tag:
                lookup_type_tag = get_lookup_type_tag(store_id)

            return HttpResponse(json.dumps({'product':product_serialized,'lookup_type_tag':lookup_type_tag}),content_type='application/json')
