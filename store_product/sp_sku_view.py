from store_product import delete_sku_cm,add_sku_cm,sp_serializer
from django.http import HttpResponse
import json

def delete_ajax(request):

    if request.method == 'POST':
        if all(key in request.POST for key in ['product_id','sku_str']):
            product_id = request.POST['product_id']
            store = request.session.get('cur_login_store')
            sku_str = request.POST['sku_str']

            if delete_sku_cm.exe(product_id=product_id,store_id=store.id,sku_str=sku_str)== True:
                product_serialized = sp_serializer.serialize_product_from_id(
                     product_id = product_id
                    ,store_id = store.id
                    ,is_include_other_store = True)  
                return HttpResponse(json.dumps(product_serialized),content_type='application/json')


def add_ajax(request):

    if request.method == 'POST':
        if all(key in request.POST for key in ['product_id','sku_str']):
            product_id = request.POST['product_id']
            store = request.session.get('cur_login_store')
            sku_str = request.POST['sku_str']

            add_sku_cm.exe(product_id=product_id,store_id=store.id,sku_str=sku_str)
            product_serialized = sp_serializer.serialize_product_from_id(
                 product_id = product_id
                ,store_id = store.id
                ,is_include_other_store = True)  
            return HttpResponse(json.dumps(product_serialized),content_type='application/json')            

