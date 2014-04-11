from store_product.models import Store_product
from product.models import ProdSkuAssoc,Product
from store_product.sp_couch.document import Store_product_document
from store_product.sp_couch import store_product_couch_getter,sp_couch_inserter
from couch import couch_constance
from couch import couch_util
from django.conf import settings
from django.db import IntegrityError


def exe(
     product_id
    ,store_id
    ,name
    ,price
    ,crv
    ,is_taxable
    ,is_sale_report
    ,p_type 
    ,p_tag
    ,assoc_sku_str 
):

    prod_bus_assoc = exe_master( \
         product_id
        ,store_id
        ,name
        ,price
        ,crv
        ,is_taxable
        ,is_sale_report
        ,assoc_sku_str
        ,p_type
        ,p_tag
    )

    sku_lst = [assoc_sku_str,]
    
    sp_couch_inserter.exe(
         store_id = store_id
        ,product_id = product_id
        ,name = name
        ,price = couch_util.decimal_2_str(price)
        ,crv = couch_util.decimal_2_str(crv)
        ,is_taxable = is_taxable
        ,is_sale_report = is_sale_report
        ,p_type = p_type
        ,p_tag = p_tag
        ,sku_lst = sku_lst
    );

    return prod_bus_assoc

def exe_master(
     product_id
    ,store_id
    ,name
    ,price
    ,crv
    ,is_taxable
    ,is_sale_report
    ,assoc_sku_str
    ,p_type
    ,p_tag
):

    prod_bus_assoc = Store_product.objects.create( \
         product_id = product_id
        ,store_id = store_id
        ,name = name
        ,price = price
        ,crv = crv
        ,is_taxable = is_taxable
        ,is_sale_report = is_sale_report 
        ,p_type = p_type
        ,p_tag = p_tag
    )

    prod_sku_assoc = ProdSkuAssoc.objects.get(product_id=product_id,sku__sku=assoc_sku_str)
    prod_sku_assoc.store_product_set.add(prod_bus_assoc);

    return prod_bus_assoc



