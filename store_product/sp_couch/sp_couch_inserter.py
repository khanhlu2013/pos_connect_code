from store_product.sp_couch.document import Store_product_document
from couch import couch_util,couch_constance

def exe(
     store_id
    ,product_id
    ,name
    ,price
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

         store_id = store_id
        ,product_id  = product_id
        ,d_type = couch_constance.STORE_PRODUCT_DOCUMENT_TYPE
        ,name = name
        ,price = couch_util.decimal_2_str(price)
        ,crv = couch_util.decimal_2_str(crv)
        ,is_taxable = is_taxable
        ,is_sale_report = is_sale_report
        ,p_type = p_type
        ,p_tag = p_tag
        ,sku_lst = sku_lst
        ,cost = couch_util.decimal_2_str(cost)
        ,vendor = vendor
        ,buydown = couch_util.decimal_2_str(buydown)
    )

    db = couch_util.get_store_db(store_id)
    store_product_document.store(db)   
 