from store_product import sp_serializer
from product.models import ProdSkuAssoc,Product
from store_product.models import Store_product
from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
import json

def _name_search_qs_alterer(qs,search_str):
    words = search_str.split()

    if len(words) == 1:
        return qs.filter(name__icontains=search_str)
    elif len(words) == 2:
        return qs.extra(where=['store_product_store_product.name ILIKE %s'], params=['%' + words[0] + '%' + words[1] + '%'])
    else:
        return None 

def angular_product_page_search_by_sku(request):
    """
        INTRO: there are 3 object return from this sku search view
            . prod_store__prod_sku__1_1 : store_product type
            . prod_store__prod_sku__1_0 : store_product type
            . prod_store__prod_sku__0_0 : product type    

        ALGORITHM
            . first i look for 1_1, and if i find it, i stop there since i don't need 1_0 and 0_0 extra data to donwload
            . only if 1_1 is empty then i go look for 1_0 (a list of sp) and 0_0 (a list of p)
    """
    sku_str = request.GET['sku_str'].lower()
    cur_login_store = request.session.get('cur_login_store')

    qs = Store_product.objects.filter(store_id=cur_login_store.id,product__prodskuassoc__sku__sku=sku_str,product__prodskuassoc__store_product_set__store_id=cur_login_store.id)
    prod_store__prod_sku__1_1__serialized = sp_serializer.Store_product_serializer(qs,many=True).data

    response ={}
    response['prod_store__prod_sku__1_1'] = prod_store__prod_sku__1_1__serialized;

    if len(prod_store__prod_sku__1_1__serialized) != 0:
        response['prod_store__prod_sku__0_0'] = None;
        response['prod_store__prod_sku__1_0'] = None;
    else:
        product_lst = list(Product.objects.filter(sku_set__sku=sku_str).prefetch_related('store_product_set','prodskuassoc_set__store_product_set'))
        prod_store__prod_sku__1_0 = []
        prod_store__prod_sku__0_0 = []

        #accumulate 1_0 (sp_lst)
        for product in product_lst:
            for sp in product.store_product_set.all():
                if sp.store.id == cur_login_store.id:
                    prod_store__prod_sku__1_0.append(sp)

        #accumulate 0_0 (p_lst)
        for product in product_lst:
            if cur_login_store.id not in [sp.store.id for sp in product.store_product_set.all()]: #this condition check that this product's store_product_set does not have sp that belong to cur_login_store
                prod_store__prod_sku__0_0.append(product)
                
        response['prod_store__prod_sku__0_0'] = sp_serializer.Product_serializer(prod_store__prod_sku__0_0,many=True).data
        response['prod_store__prod_sku__1_0'] = sp_serializer.Store_product_serializer(prod_store__prod_sku__1_0,many=True).data

    return HttpResponse(json.dumps(response,cls=DjangoJSONEncoder),content_type='application/json')


def angular_product_page_search_by_name(request):
    search_str = request.GET['name_str']
    search_str = search_str.strip()
    if len(search_str) == 0:
        return

    cur_login_store = request.session.get('cur_login_store')
    qs = Store_product.objects.filter(store_id = cur_login_store.id)
    qs = list(_name_search_qs_alterer(qs,search_str))
    sp_lst_serialized = sp_serializer.Store_product_serializer(qs,many=True).data
    return HttpResponse(json.dumps(sp_lst_serialized,cls=DjangoJSONEncoder),content_type='application/json')    

