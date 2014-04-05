from store_product import new_sp_inserter,old_sp_inserter
from django.http import HttpResponse
from store_product import sp_serializer
from product.models import Product
from decimal import Decimal
import json

def sp_creator_ajax_view(request):

    if      request.POST.has_key('product_id') \
        and request.POST.has_key('name') \
        and request.POST.has_key('price') \
        and request.POST.has_key('crv') \
        and request.POST.has_key('is_taxable') \
        and request.POST.has_key('is_sale_report') \
        and request.POST.has_key('sku_str') \
        and request.POST.has_key('p_type') \
        and request.POST.has_key('p_tag'):


        product_id_raw      = request.POST['product_id']
        name_raw            = request.POST['name'] 
        price_raw           = request.POST['price']
        crv_raw             = request.POST['crv']
        is_taxable_raw      = request.POST['is_taxable']
        is_sale_report_raw  = request.POST['is_sale_report']
        sku_str_raw         = request.POST['sku_str']
        p_type_raw          = request.POST['p_type']
        p_tag_raw           = request.POST['p_tag']


        product_id      = int(product_id_raw) if len(product_id_raw.strip()) != 0 else None
        name            = name_raw
        price           = Decimal(price_raw)
        crv             = Decimal(crv_raw) if len(crv_raw.strip()) !=0 else None 
        is_taxable      = True if is_taxable_raw == 'true' else False
        is_sale_report  = True if is_sale_report_raw == 'true' else False
        sku_str         = sku_str_raw
        p_type          = p_type_raw.strip() if len(p_type_raw.strip()) !=0 else None
        p_tag           = p_tag_raw.strip() if len(p_tag_raw.strip()) !=0 else None


        sp = None
        cur_login_store = request.session
        store_id = request.session.get('cur_login_store').id

        if product_id:
            sp = old_sp_inserter.exe (
                 product_id
                ,store_id

                ,name
                ,price
                ,crv
                ,is_taxable
                ,is_sale_report
                ,p_type
                ,p_tag
                ,sku_str
            )
        else:
            sp = new_sp_inserter.exe (
                 store_id = store_id

                ,name = name
                ,price = price
                ,crv = crv
                ,is_taxable = is_taxable
                ,is_sale_report = is_sale_report
                ,p_type = p_type
                ,p_tag = p_tag
                ,sku_str = sku_str
            )

        if sp != None:
            product_serialized = sp_serializer.serialize_product_from_id(sp.product.id)
            return HttpResponse(json.dumps(product_serialized),content_type='application/json')


