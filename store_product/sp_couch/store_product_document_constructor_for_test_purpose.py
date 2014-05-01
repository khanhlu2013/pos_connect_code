from couch import couch_constance

def exe(
         sp_doc_id
        ,store_id
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
    return {
         '_id' : sp_doc_id # a dummy sp._id that we pretent pouchdb created. we don't care because we delete offline create sp, and create it online to sync down again
        ,'d_type' : couch_constance.STORE_PRODUCT_DOCUMENT_TYPE
        ,'name' : name
        ,'price' : price
        ,'crv' : crv
        ,'is_taxable' : is_taxable
        ,'is_sale_report' : is_sale_report
        ,'p_type' : p_type
        ,'p_tag' : p_tag
        ,'sku_lst' : sku_lst
        ,'store_id' : store_id
        ,'product_id'  : None
        ,'cost' : cost
        ,'vendor' : vendor
        ,'buydown' : buydown
    }   