from product.models import Product,Sku,ProdSkuAssoc
from store_product.models import Store_product
from store_product.cm import insert_couch

def exe( \
     store_id
    ,name
    ,price
    ,value_customer_price
    ,crv
    ,is_taxable
    ,is_sale_report
    ,p_type
    ,p_tag
    ,sku_str
    ,cost
    ,vendor
    ,buydown
    ,offline_doc_id = None
):

    prod_bus_assoc = exe_master( \
         name = name
        ,price = price
        ,value_customer_price = value_customer_price
        ,crv = crv
        ,is_taxable = is_taxable
        ,is_sale_report = is_sale_report
        ,store_id = store_id
        ,sku_str = sku_str
        ,p_type = p_type
        ,p_tag = p_tag
        ,cost = cost
        ,vendor = vendor
        ,buydown = buydown
        ,offline_doc_id = offline_doc_id
    )

    insert_couch.exe(
         id = prod_bus_assoc.id
        ,store_id = store_id
        ,product_id = prod_bus_assoc.product.id
        ,name = name
        ,price = price
        ,value_customer_price = value_customer_price
        ,crv = crv
        ,is_taxable = is_taxable
        ,is_sale_report = is_sale_report
        ,p_type = p_type
        ,p_tag = p_tag
        ,sku_lst = [sku_str,]
        ,cost = cost
        ,vendor = vendor
        ,buydown = buydown
        ,breakdown_assoc_lst = [] #when don't allow setting up kit-breakdown info when creating new sp. we only setup this info after sp is created
    )

    return prod_bus_assoc

def exe_master( \
     name
    ,price
    ,value_customer_price
    ,crv
    ,is_taxable
    ,is_sale_report
    ,store_id
    ,sku_str
    ,p_type
    ,p_tag
    ,cost
    ,vendor
    ,buydown
    ,offline_doc_id
):

    #CREATE PRODUCT
    product = Product.objects.create(
        _name_admin = '',
        _size_admin = '',
        _unit_admin = None,
        temp_name = name,
        creator_id = store_id
    )

    #CREATE PROD_BUS_ASSOC

    prod_bus_assoc = Store_product.objects.create(
         name = name
        ,price = price
        ,value_customer_price = value_customer_price
        ,crv = crv
        ,is_taxable = is_taxable
        ,is_sale_report = is_sale_report
        ,store_id = store_id
        ,product = product
        ,p_type = p_type
        ,p_tag = p_tag
        ,cost = cost
        ,vendor = vendor
        ,buydown = buydown
        ,sp_doc_id = offline_doc_id
    )

    #CREATE SKU
    if sku_str:
        #CREATE/GET SKU
        sku,created = Sku.objects.get_or_create(
            sku__exact = sku_str,
            defaults={'sku':sku_str,'creator_id':store_id,'is_approved':False}
        )
        #CREATE PROD_SKU_ASSOC 
        prodSkuAssoc = ProdSkuAssoc.objects.create(
            product = product,
            sku = sku,
            creator_id = store_id,
            is_approve_override = False
        )
        #CREATE PROD_SKU_ASSOC__PROD_BUS_ASSOC
        prodSkuAssoc.store_product_set.add(prod_bus_assoc)

    return prod_bus_assoc

