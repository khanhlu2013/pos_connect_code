from store_product import sp_serializer
from store_product.cm import sp_updator
from store_product.models import Store_product
from django.http import HttpResponse
import json
from django.core.serializers.json import DjangoJSONEncoder
from util import value_cleaner

def exe(request):
    cur_login_store = request.session.get('cur_login_store')
    sp = json.loads(request.POST['sp'])
    product_id = value_cleaner.to_int(sp['product_id'])
    
    #verify sp belong to this store
    Store_product.objects.get(product_id=product_id,store_id=cur_login_store.id)

    updated_sp = sp_updator.exe( \
         product_id = product_id
        ,store_id = cur_login_store.id
        ,name = value_cleaner.to_string(sp['name'])
        ,price = value_cleaner.to_float(sp['price'])
        ,value_customer_price = value_cleaner.to_float(sp['value_customer_price'])
        ,crv = value_cleaner.to_float(sp['crv'])
        ,is_taxable = sp['is_taxable']
        ,is_sale_report = sp['is_sale_report']
        ,p_type = value_cleaner.to_string(sp['p_type'])
        ,p_tag = value_cleaner.to_string(sp['p_tag'])
        ,vendor = value_cleaner.to_string(sp['vendor'])
        ,cost = value_cleaner.to_float(sp['cost'])
        ,buydown = value_cleaner.to_float(sp['buydown'])
    )
    sp_serialized = sp_serializer.Store_product_serializer(updated_sp).data 
    return HttpResponse(json.dumps(sp_serialized,cls=DjangoJSONEncoder),content_type='application/json')