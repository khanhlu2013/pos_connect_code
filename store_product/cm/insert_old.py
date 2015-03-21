from store_product.models import Store_product
from product.models import ProdSkuAssoc
from store_product.cm import insert_sp_2_couch
from util import couch_db_util

def exe(
     product_id
    ,store_id
    ,name
    ,price
    ,value_customer_price
    ,crv
    ,is_taxable
    ,is_sale_report
    ,p_type 
    ,p_tag
    ,assoc_sku_str 
    ,cost
    ,vendor
    ,buydown
):

    prod_bus_assoc = exe_master( \
         product_id = product_id
        ,store_id = store_id
        ,name = name
        ,price = price
        ,value_customer_price = value_customer_price
        ,crv = crv
        ,is_taxable = is_taxable
        ,is_sale_report = is_sale_report
        ,p_type = p_type
        ,p_tag = p_tag
        ,assoc_sku_str = assoc_sku_str
        ,cost = cost
        ,vendor = vendor
        ,buydown = buydown
    )

    sku_lst = [assoc_sku_str,]
    
    insert_sp_2_couch.exe(
         id = prod_bus_assoc.id
        ,store_id = store_id
        ,product_id = product_id
        ,name = name
        ,price = couch_db_util.decimal_2_str(price)
        ,value_customer_price = couch_db_util.decimal_2_str(value_customer_price)
        ,crv = couch_db_util.decimal_2_str(crv)
        ,is_taxable = is_taxable
        ,is_sale_report = is_sale_report
        ,p_type = p_type
        ,p_tag = p_tag
        ,sku_lst = sku_lst
        ,cost = cost
        ,vendor = vendor
        ,buydown = buydown
        ,breakdown_assoc_lst = [] #when don't allow setting up kit-breakdown info when creating new sp. we only setup this info after sp is created
    );

    return prod_bus_assoc

def exe_master(
     product_id
    ,store_id
    ,name
    ,price
    ,value_customer_price
    ,crv
    ,is_taxable
    ,is_sale_report
    ,p_type
    ,p_tag    
    ,assoc_sku_str
    ,cost
    ,vendor
    ,buydown
):

    prod_bus_assoc = Store_product.objects.create( \
         product_id = product_id
        ,store_id = store_id
        ,name = name
        ,price = price
        ,value_customer_price = value_customer_price
        ,crv = crv
        ,is_taxable = is_taxable
        ,is_sale_report = is_sale_report 
        ,p_type = p_type
        ,p_tag = p_tag
        ,cost = cost
        ,vendor = vendor
        ,buydown = buydown
    )

    prod_sku_assoc = ProdSkuAssoc.objects.get(product_id=product_id,sku__sku=assoc_sku_str)
    prod_sku_assoc.store_product_set.add(prod_bus_assoc);

    return prod_bus_assoc