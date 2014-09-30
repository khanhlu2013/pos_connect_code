from store_product.sp_couch.document import Store_product_document
from django.conf import settings
from couch import couch_util

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
):
    store_product_document = Store_product_document(
         id = id
        ,product_id  = product_id
        ,store_id = store_id
        ,d_type = settings.STORE_PRODUCT_DOCUMENT_TYPE
        ,name = name
        ,price = couch_util.decimal_2_str(price)
        ,value_customer_price = couch_util.decimal_2_str(value_customer_price)
        ,crv = couch_util.decimal_2_str(crv)
        ,is_taxable = is_taxable
        ,is_sale_report = is_sale_report
        ,p_type = p_type
        ,p_tag = p_tag
        ,sku_lst = sku_lst
        ,cost = couch_util.decimal_2_str(cost)
        ,vendor = vendor
        ,buydown = couch_util.decimal_2_str(buydown)
        ,breakdown_assoc_lst = [] #when don't allow setting up kit-breakdown info when creating new sp. we only setup this info after sp is created
    )
    db = couch_util.get_store_db(store_id)
    store_product_document.store(db)     