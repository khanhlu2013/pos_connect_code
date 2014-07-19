from store_product import sp_updator,sp_serializer
from store_product.models import Store_product
from django.http import HttpResponse
import json
from django.core.serializers.json import DjangoJSONEncoder
from util import number,boolean,string
from decimal import Decimal

def sp_update_angular_view(request):
    cur_login_store = request.session.get('cur_login_store')
    sp = json.loads(request.POST['sp'])
    
    product_id_raw = sp['product_id']
    name_raw = string.strip(string = sp['name'],is_convert_null_if_emtpy =True)
    price_raw = sp['price']
    value_customer_price_raw = sp['value_customer_price']
    crv_raw = sp['crv']
    is_taxable_raw = sp['is_taxable']
    is_sale_report_raw = sp['is_sale_report']
    p_type_raw = string.strip(string = sp['p_type'],is_convert_null_if_emtpy =True)
    p_tag_raw = string.strip(string = sp['p_tag'],is_convert_null_if_emtpy =True)
    vendor_raw = string.strip(string = sp['vendor'],is_convert_null_if_emtpy =True)
    cost_raw = sp['cost']
    buydown_raw = sp['buydown']    

    product_id  = int(product_id_raw)
    name = name_raw
    price = Decimal(price_raw)
    value_customer_price = number.get_double_from_obj(value_customer_price_raw)
    crv = number.get_double_from_obj(crv_raw)
    is_taxable = is_taxable_raw
    is_sale_report = is_sale_report_raw
    p_type = p_type_raw
    p_tag = p_tag_raw
    vendor = vendor_raw
    cost = number.get_double_from_obj(cost_raw)
    buydown = number.get_double_from_obj(buydown_raw)

    #verify sp belong to this store
    Store_product.objects.get(product_id=product_id,store_id=cur_login_store.id)

    updated_sp = sp_updator.exe( \
         product_id = product_id
        ,store_id = cur_login_store.id
        ,name = name
        ,price = price
        ,value_customer_price = value_customer_price
        ,crv = crv
        ,is_taxable = is_taxable
        ,is_sale_report = is_sale_report
        ,p_type = p_type
        ,p_tag = p_tag
        ,vendor = vendor
        ,cost = cost
        ,buydown = buydown
    )
    sp_serialized = sp_serializer.Store_product_serializer(updated_sp).data 
    return HttpResponse(json.dumps(sp_serialized,cls=DjangoJSONEncoder),content_type='application/json')


def sp_update_view(request):
    cur_login_store = request.session.get('cur_login_store')
    
    product_id_raw = request.POST['product_id']
    name_raw = request.POST['name']
    price_raw = request.POST['price']
    value_customer_price_raw = request.POST['value_customer_price']
    crv_raw = request.POST['crv']
    is_taxable_raw = request.POST['is_taxable']
    is_sale_report_raw = request.POST['is_sale_report']
    p_type_raw = request.POST['p_type']
    p_tag_raw = request.POST['p_tag']
    vendor_raw = request.POST['vendor']
    cost_raw = request.POST['cost']
    buydown_raw = request.POST['buydown']    
    
    product_id  = int(product_id_raw)
    name = name_raw.strip()
    price = Decimal(price_raw)
    value_customer_price = number.get_double_from_str(value_customer_price_raw)
    crv = number.get_double_from_str(crv_raw)
    is_taxable = boolean.get_boolean_from_str(is_taxable_raw)
    is_sale_report = boolean.get_boolean_from_str(is_sale_report_raw)
    p_type = p_type_raw.strip() if len(p_type_raw.strip()) !=0 else None
    p_tag = p_tag_raw.strip() if len(p_tag_raw.strip()) !=0 else None
    vendor = vendor_raw.strip() if len(vendor_raw.strip()) !=0 else None
    cost = number.get_double_from_str(cost_raw)
    buydown = number.get_double_from_str(buydown_raw)

    #verify data
    if price == None or is_taxable == None or is_sale_report == None:
        return

    #verify sp belong to this store, and crv,cost,bd param is blank if it is a kit: we can not directly editing these info for kit. it is calculated based on breakdown
    sp =  Store_product.objects.prefetch_related('breakdown_lst').get(product_id=product_id,store_id=cur_login_store.id)
    if sp.breakdown_lst.count() != 0 and (cost != None or crv != None or buydown != None):
        return

    sp_updator.exe( \
         product_id = sp.product.id
        ,store_id = cur_login_store.id
        ,name = name
        ,price = price
        ,value_customer_price = value_customer_price
        ,crv = crv
        ,is_taxable = is_taxable
        ,is_sale_report = is_sale_report
        ,p_type = p_type
        ,p_tag = p_tag
        ,vendor = vendor
        ,cost = cost
        ,buydown = buydown
    )
    product_serialized = sp_serializer.serialize_product_from_id(product_id=sp.product.id,store_id = cur_login_store.id,is_include_other_store = False)     
    return HttpResponse(json.dumps(product_serialized,cls=DjangoJSONEncoder),content_type='application/json')
