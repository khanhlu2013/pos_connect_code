from django.views.generic import UpdateView
from django.shortcuts import get_object_or_404
from django.core.urlresolvers import reverse_lazy
from django.forms import ModelForm
from store_product.models import Store_product
from store_product import update_store_product_cm,sp_serializer
from django.http import HttpResponse
import json

def updator_ajax(request):

    if all(key in request.POST for key in ('product_id','name','price','crv','is_taxable','is_sale_report','p_type','p_tag')):
        cur_login_store = request.session.get('cur_login_store')

        product_id_str = request.POST['product_id']
        name = request.POST['name']
        price_str = request.POST['price']
        crv_str = request.POST['crv']
        is_taxable_str = request.POST['is_taxable']
        is_sale_report_str = request.POST['is_sale_report']
        p_type_raw = request.POST['p_type']
        p_tag_raw = request.POST['p_tag']
        errmsg = ''

        #validate
        product_id = None
        price = None
        crv = None
        is_taxable = None
        is_sale_report = None
        p_type = p_type_raw
        p_tag = p_tag_raw

        #validate product_id
        try:
            product_id = int(product_id_str)
        except ValueError:
            errmsg += 'product id is not valid'

        #validate name
        if len(name) == 0:
            errmsg += 'Name is emtpy\n'

        #validate price
        try:
            price = float(price_str)
            if price <=0:
                errmsg += 'price is negative'
        except ValueError:
            errmsg += 'price is not valid'

        #validate crv
        if len(crv_str) != 0:
            try:
                crv = float(crv_str)
                if crv < 0:
                    errmsg += 'crv is negative'
            except ValueError:
                errmsg += 'crv is not valid'

        #validate is_taxable
        if is_taxable_str == 'true':
            is_taxable = True
        elif is_taxable_str == 'false':
            is_taxable = False
        else:
            errmsg += 'taxable is not valid'

        #validate is_sale_report
        if is_sale_report_str == 'true':
            is_sale_report = True
        elif is_sale_report_str == 'false':
            is_sale_report = False
        else:
            errmsg += 'is sale report is not valid'

        product_serialized = None
        if len(errmsg) == 0:
            try:
                sp = update_store_product_cm.exe( \
                     product_id
                    ,cur_login_store.id
                    ,name
                    ,price
                    ,crv
                    ,is_taxable
                    ,is_sale_report
                    ,p_type
                    ,p_tag
                )
                product_serialized = sp_serializer.serialize_product_from_id(sp.product.id)

            except Exception,e:
                errmsg = 'there is error updating product'
                print(e)

        return HttpResponse(json.dumps({'error_message':errmsg,'product':product_serialized}),mimetype='application/javascript')





