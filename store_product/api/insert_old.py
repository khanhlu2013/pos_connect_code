from django.http import HttpResponse
from store_product import sp_serializer
from django.core.serializers.json import DjangoJSONEncoder
import json
from store_product.cm import insert_old

def exe(request):
    product_id = request.POST['product_id']
    sku_str = request.POST['sku_str']
    sp = json.loads(request.POST['sp'])
    store_id = request.session.get('cur_login_store').id

    sp = insert_old.exe (
         product_id = product_id
        ,store_id = store_id
        ,name = sp['name']
        ,price = sp['price']
        ,value_customer_price = sp.get('value_customer_price')
        ,crv = sp.get('crv')
        ,is_taxable = sp['is_taxable']
        ,is_sale_report = sp['is_sale_report']
        ,p_type = sp.get('p_type')
        ,p_tag = sp.get('p_tag')
        ,assoc_sku_str = sku_str
        ,cost = sp.get('cost')
        ,vendor = sp.get('vendor')
        ,buydown = sp.get('buydown')
    )

    sp_serialized = sp_serializer.Store_product_serializer(sp).data
    return HttpResponse(json.dumps(sp_serialized,cls=DjangoJSONEncoder),content_type='application/json')