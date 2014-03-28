from store_product import insert_new_store_product_cm,insert_old_store_product_cm
from django.http import HttpResponse
from django.core import serializers
from decimal import Decimal

def sp_creator_ajax_view(request):

    if      request.POST.has_key('product_id') \
        and request.POST.has_key('name') \
        and request.POST.has_key('price') \
        and request.POST.has_key('crv') \
        and request.POST.has_key('isTaxable') \
        and request.POST.has_key('isTaxReport') \
        and request.POST.has_key('isSaleReport') \
        and request.POST.has_key('sku_str') \
        and request.POST.has_key('p_type') \
        and request.POST.has_key('p_tag'):


        product_id_raw      = request.POST['product_id']
        name_raw            = request.POST['name'] 
        price_raw           = request.POST['price']
        crv_raw             = request.POST['crv']
        isTaxable_raw       = request.POST['isTaxable']
        isTaxReport_raw     = request.POST['isTaxReport']
        isSaleReport_raw    = request.POST['isSaleReport']
        sku_str_raw         = request.POST['sku_str']
        p_type_raw          = request.POST['p_type']
        p_tag_raw           = request.POST['p_tag']


        product_id      = int(product_id_raw) if len(product_id_raw.strip()) != 0 else None
        name            = name_raw
        price           = Decimal(price_raw)
        crv             = Decimal(crv_raw) if len(crv_raw.strip()) !=0 else None 
        isTaxable       = True if isTaxable_raw == 'true' else False
        isTaxReport     = True if isTaxReport_raw == 'true' else False
        isSaleReport    = True if isSaleReport_raw == 'true' else False
        sku_str         = sku_str_raw
        p_type          = p_type_raw.strip() if len(p_type_raw.strip()) !=0 else None
        p_tag           = p_tag_raw.strip() if len(p_tag_raw.strip()) !=0 else None

        
        sp = None
        cur_login_store = request.session
        business_id = request.session.get('cur_login_store').id


        if product_id:
            sp = insert_old_store_product_cm.exe (
                 product_id
                ,business_id

                ,name
                ,price
                ,crv
                ,isTaxable
                ,isTaxReport
                ,isSaleReport
                ,sku_str
                ,p_type 
                ,p_tag
            )
        else:
            sp = insert_new_store_product_cm.exe (
                 business_id

                ,name
                ,price
                ,crv
                ,isTaxable
                ,isTaxReport
                ,isSaleReport
                ,sku_str
                ,p_type 
                ,p_tag
            )

        if sp != None:
            return HttpResponse(serializers.serialize('json',[sp,]),content_type='application/json')


