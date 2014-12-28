from django.http import HttpResponse
from store_product import sp_serializer
from django.core.serializers.json import DjangoJSONEncoder
import json
from util import value_cleaner
from store_product.cm import insert_new

def exe(request):
    sp = json.loads(request.POST['sp'])
    sku_str = request.POST['sku_str']
    store_id = request.session.get('cur_login_store').id
    sp_django = insert_new.exe (
         store_id = store_id
        ,name = value_cleaner.to_string(sp['name'])
        ,price = value_cleaner.to_float(sp['price'])
        ,value_customer_price = value_cleaner.to_float(sp.get('value_customer_price'))
        ,crv = value_cleaner.to_float(sp.get('crv'))
        ,is_taxable = sp['is_taxable']
        ,is_sale_report = sp['is_sale_report']
        ,p_type = value_cleaner.to_string(sp.get('p_type'))
        ,p_tag = value_cleaner.to_string(sp.get('p_tag'))
        ,sku_str = value_cleaner.to_string(sku_str)
        ,cost = value_cleaner.to_float(sp.get('cost'))
        ,vendor = value_cleaner.to_string(sp.get('vendor'))
        ,buydown = value_cleaner.to_float(sp.get('buydown'))
    )
    sp_serialized = sp_serializer.Store_product_serializer(sp_django).data
    return HttpResponse(json.dumps(sp_serialized,cls=DjangoJSONEncoder),content_type="application/json")