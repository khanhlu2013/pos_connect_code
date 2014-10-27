from django.http import HttpResponse
from store_product import sp_serializer
from django.core.serializers.json import DjangoJSONEncoder
import json
from util import boolean,number
from store_product.cm import insert_new

def exe(request):
    sp = json.loads(request.POST['sp'])
    sku_str = request.POST['sku_str']
    store_id = request.session.get('cur_login_store').id

    sp = insert_new.exe (
         store_id = store_id
        ,name = sp['name']
        ,price = number.get_double_from_obj(sp['price'])
        ,value_customer_price = number.get_double_from_obj(sp.get('value_customer_price'))
        ,crv = number.get_double_from_obj(sp.get('crv'))
        ,is_taxable = sp['is_taxable']
        ,is_sale_report = sp['is_sale_report']
        ,p_type = sp.get('p_type')
        ,p_tag = sp.get('p_tag')
        ,sku_str = sku_str
        ,cost = number.get_double_from_obj(sp.get('cost'))
        ,vendor = sp.get('vendor')
        ,buydown = number.get_double_from_obj(sp.get('buydown'))
    )
    sp_serialized = sp_serializer.Store_product_serializer(sp).data
    return HttpResponse(json.dumps(sp_serialized,cls=DjangoJSONEncoder),content_type="application/json")