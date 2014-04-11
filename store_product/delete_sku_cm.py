from product.models import Product
from store_product.sp_couch import store_product_couch_getter
from store_product import sp_serializer
from couch import couch_util


def exe(product_id,store_id,sku_str):
    product = Product.objects.prefetch_related('prodskuassoc_set__store_product_set').get(pk=product_id)

    prod_sku_assoc = None
    for item in product.prodskuassoc_set.all():
        if item.sku.sku == sku_str:
            prod_sku_assoc = item
            break

    if prod_sku_assoc.is_deletable(store_id):
        prod_sku_assoc.delete()
        exe_couch(product_id,store_id,sku_str)  
        return True


def exe_couch(product_id,store_id,sku_str):

    prod_bus_assoc_doc = store_product_couch_getter.exe(product_id,store_id)
    sku_lst = prod_bus_assoc_doc['sku_lst']

    for idx,cur_sku in enumerate(sku_lst):
        if(cur_sku == sku_str):
            del sku_lst[idx]
            break
    db = couch_util.get_store_db(store_id)
    db.update([prod_bus_assoc_doc,])