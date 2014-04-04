from product.models import ProdSkuAssoc,Sku
from store_product.sp_couch import store_product_couch_getter
from couch import couch_util


def content_management(
         sku_str
        ,product
        ,creator
        ,prod_bus_assoc ):

    prod_sku_assoc = content_management_relational_db(
         sku_str
        ,product
        ,creator
        ,prod_bus_assoc )

    content_management_couch_db( \
         sku_str
        ,product.id
        ,prod_bus_assoc.store.id )

    #RETURN
    return prod_sku_assoc

def content_management_relational_db( \
    sku_str,
    product,
    creator,
    prod_bus_assoc ):

    #CREATE SKU
    sku,created_sku = Sku.objects.get_or_create(
        sku__exact=sku_str,
        defaults={'sku':sku_str,'creator':prod_bus_assoc.store,'is_approved':False})

    #CREATE PROD_SKU_ASSOC
    prod_sku_assoc = ProdSkuAssoc.objects.create(
         sku = sku
        ,product = product
        ,creator = creator
        ,is_approve_override = False )
    prod_sku_assoc.save()
    prod_sku_assoc.store_product_lst.add(prod_bus_assoc)

    return prod_sku_assoc

def content_management_couch_db(sku_str,product_id,store_id):
    prod_bus_assoc_doc = store_product_couch_getter.exe(product_id,store_id)
    if sku_str in [sku for sku in prod_bus_assoc_doc["sku_lst"]]:
        raise Exception('sku is already exist for this product')
    else:
        prod_bus_assoc_doc['sku_lst'].append(sku_str)
        db = couch_util.get_store_db(store_id)
        db.save(prod_bus_assoc_doc)
