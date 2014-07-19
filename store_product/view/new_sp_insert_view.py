from store_product import new_sp_inserter
from django.http import HttpResponse
from store_product import sp_serializer
from decimal import Decimal
from django.core.serializers.json import DjangoJSONEncoder
import json
from util import boolean,number

def new_sp_insert_angular_view(request):
    sp = json.loads(request.POST['sp'])
    sku_str = request.POST['sku_str']
    store_id = request.session.get('cur_login_store').id

    sp = new_sp_inserter.exe (
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


def new_sp_insert_view(request):
    name_raw                    = request.POST['name'] 
    price_raw                   = request.POST['price']
    value_customer_price_raw    = request.POST['value_customer_price']
    crv_raw                     = request.POST['crv']
    is_taxable_raw              = request.POST['is_taxable']
    is_sale_report_raw          = request.POST['is_sale_report']
    sku_str_raw                 = request.POST['sku_str']
    p_type_raw                  = request.POST['p_type']
    p_tag_raw                   = request.POST['p_tag']
    cost_raw                    = request.POST['cost']
    vendor_raw                  = request.POST['vendor']
    buydown_raw                 = request.POST['buydown']

    name                        = name_raw.strip()
    price                       = Decimal(price_raw)
    value_customer_price        = Decimal(value_customer_price_raw) if len(value_customer_price_raw.strip()) !=0 else None 
    crv                         = Decimal(crv_raw) if len(crv_raw.strip()) !=0 else None 
    is_taxable                  = boolean.get_boolean_from_str(is_taxable_raw)
    is_sale_report              = boolean.get_boolean_from_str(is_sale_report_raw)
    sku_str                     = sku_str_raw.strip() if len(sku_str_raw.strip()) !=0 else None
    p_type                      = p_type_raw.strip() if len(p_type_raw.strip()) !=0 else None
    p_tag                       = p_tag_raw.strip() if len(p_tag_raw.strip()) !=0 else None
    cost                        = Decimal(cost_raw) if len(cost_raw.strip()) !=0 else None 
    vendor                      = vendor_raw.strip() if len(vendor_raw.strip()) !=0 else None
    buydown                     = Decimal(buydown_raw) if len(buydown_raw.strip()) !=0 else None 

    store_id = request.session.get('cur_login_store').id

    sp = new_sp_inserter.exe (
         store_id = store_id
        ,name = name
        ,price = price
        ,value_customer_price = value_customer_price
        ,crv = crv
        ,is_taxable = is_taxable
        ,is_sale_report = is_sale_report
        ,p_type = p_type
        ,p_tag = p_tag
        ,sku_str = sku_str
        ,cost = cost
        ,vendor = vendor
        ,buydown = buydown
    )

    product_serialized = sp_serializer.serialize_product_from_id(product_id = sp.product.id,store_id=store_id,is_include_other_store = False)
    return HttpResponse(json.dumps(product_serialized,cls=DjangoJSONEncoder),content_type='application/json')





