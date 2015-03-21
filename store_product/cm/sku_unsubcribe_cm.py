from product.models import Product
from store_product import dao_couch
from store_product import sp_serializer
from util import couch_db_util
from store_product.models import Store_product

def exe(product_id,store_id,sku_str):
    sp = Store_product.objects.prefetch_related('product__prodskuassoc_set__store_product_set').get(store_id=store_id,product_id=product_id)

    prod_sku_assoc = None
    for assoc in sp.product.prodskuassoc_set.all():
        if assoc.sku.sku == sku_str:
            prod_sku_assoc = assoc
            break;

    subcribe_sp_lst = prod_sku_assoc.store_product_set.all()
    for subcribe_sp in subcribe_sp_lst:
        if subcribe_sp.store.id == store_id:
            prod_sku_assoc.store_product_set.remove(subcribe_sp.id)
            if len(subcribe_sp_lst) == 1: #if there is only one subcriber, then after remove that only subscription, we remove assoc as well
                prod_sku_assoc.delete()

    exe_couch(product_id=product_id,store_id=store_id,sku_str=sku_str)


def exe_couch(product_id,store_id,sku_str):
    prod_bus_assoc_doc = dao_couch.get_item(product_id,store_id)
    sku_lst = prod_bus_assoc_doc['sku_lst']

    for idx,cur_sku in enumerate(sku_lst):
        if(cur_sku == sku_str):
            del sku_lst[idx]
            break
    db = couch_db_util.get_store_db(store_id)
    db.update([prod_bus_assoc_doc,])
