from store_product import sp_serializer
from store_product.cm import add_sku_cm,delete_sku_cm,sku_unsubcribe_cm
from django.http import HttpResponse
import json
from django.core.serializers.json import DjangoJSONEncoder
from store_product.models import Store_product


def sku_assoc_delete_angular_view(request):
    product_id = json.loads(request.POST['product_id'])
    sku_str = request.POST['sku_str']
    store_id = request.session.get('cur_login_store').id

    sku_unsubcribe_cm.exe(product_id=product_id,store_id=store_id,sku_str=sku_str)
    sp = Store_product.objects.prefetch_related('product__prodskuassoc_set__store_product_set').get(store_id=store_id,product_id=product_id)
    sp_serialized = sp_serializer.Store_product_serializer(sp).data
    return HttpResponse(json.dumps(sp_serialized,cls=DjangoJSONEncoder),content_type="application/json")


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
                return HttpResponse(json.dumps(product_serialized,cls=DjangoJSONEncoder),content_type='application/json')


def sku_add_angular_view(request):
    product_id = request.POST['product_id']
    sku_str = request.POST['sku_str']
    store_id = request.session.get('cur_login_store').id
    
    add_sku_cm.exe(product_id=product_id,store_id=store_id,sku_str=sku_str)
    sp = Store_product.objects.prefetch_related('product__prodskuassoc_set__store_product_set').get(store_id=store_id,product_id=product_id)
    sp_serialized = sp_serializer.Store_product_serializer(sp).data
    return HttpResponse(json.dumps(sp_serialized,cls=DjangoJSONEncoder),content_type='application/json')

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
            return HttpResponse(json.dumps(product_serialized,cls=DjangoJSONEncoder),content_type='application/json')            

