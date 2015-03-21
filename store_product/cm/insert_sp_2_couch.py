from store_product.models import Store_product_document
from django.conf import settings
from util import couch_db_util

def exe(
     id
    ,store_id
    ,product_id
    ,name
    ,price
    ,value_customer_price
    ,crv
    ,is_taxable
    ,is_sale_report
    ,p_type
    ,p_tag
    ,sku_lst
    ,cost
    ,vendor
    ,buydown
    ,breakdown_assoc_lst
):
    store_product_document = Store_product_document(
         id = id
        ,product_id  = product_id
        ,store_id = store_id
        ,d_type = settings.STORE_PRODUCT_DOCUMENT_TYPE
        ,name = name
        ,price = price
        ,value_customer_price = value_customer_price
        ,crv = crv
        ,is_taxable = is_taxable
        ,is_sale_report = is_sale_report
        ,p_type = p_type
        ,p_tag = p_tag
        ,sku_lst = sku_lst
        ,cost = cost
        ,vendor = vendor
        ,buydown = buydown
        ,breakdown_assoc_lst = breakdown_assoc_lst 
    )
    db = couch_db_util.get_store_db(store_id)
    store_product_document.store(db)     