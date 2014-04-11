from product.models import ProdSkuAssoc,Sku
from store_product.sp_couch import store_product_couch_getter
from couch import couch_util
from store_product.models import Store_product

SKU_IS_EXIST_FOR_PRODUCT = 'Sku is exist for product'

def exe(
         sku_str
        ,product_id
        ,store_id
    ):

    exe_master(
         sku_str
        ,product_id
        ,store_id
    )

    exe_couch( \
         sku_str
        ,product_id
        ,store_id)


def exe_master( \
     sku_str
    ,product_id
    ,store_id
):
    #GET STORE_PRODUCT
    sp = Store_product.objects.get(store_id=store_id,product_id=product_id)

    #CREATE SKU
    sku,created_sku = Sku.objects.get_or_create(
        sku__exact=sku_str,
        defaults={'sku':sku_str,'creator_id':store_id,'is_approved':False}
    )

    #CREATE PROD_SKU_ASSOC
    prod_sku_assoc,created_prodskuassoc = ProdSkuAssoc.objects.get_or_create(
         sku_id = sku.id
        ,product_id = product_id
        ,defaults={'creator_id':store_id,'is_approve_override':False}
    )

    if sp in prod_sku_assoc.store_product_set.all():
        raise Exception('sku is existed for this product')

    prod_sku_assoc.store_product_set.add(sp)
    prod_sku_assoc.save()


def exe_couch(sku_str,product_id,store_id):
    prod_bus_assoc_doc = store_product_couch_getter.exe(product_id,store_id)
    if sku_str in [sku for sku in prod_bus_assoc_doc["sku_lst"]]:
        raise Exception('sku is already exist for this product')
    else:
        prod_bus_assoc_doc['sku_lst'].append(sku_str)
        db = couch_util.get_store_db(store_id)
        db.save(prod_bus_assoc_doc)
