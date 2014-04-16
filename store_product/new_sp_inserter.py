from product.models import Product,Sku,ProdSkuAssoc
from store_product.models import Store_product
from store_product.sp_couch import sp_couch_inserter
from store_product.sp_couch.document import Store_product_document
from couch import couch_constance,couch_util


def exe( \
     store_id
    ,name
    ,price
    ,crv
    ,is_taxable
    ,is_sale_report
    ,p_type
    ,p_tag
    ,sku_str
):

    prod_bus_assoc = exe_master( \
         name = name
        ,price = price
        ,crv = crv
        ,is_taxable = is_taxable
        ,is_sale_report = is_sale_report
        ,store_id = store_id
        ,sku_str = sku_str
        ,p_type = p_type
        ,p_tag = p_tag
    )

    sp_couch_inserter.exe(
         store_id = store_id
        ,product_id = prod_bus_assoc.product.id
        ,name = name
        ,price = price
        ,crv = crv
        ,is_taxable = is_taxable
        ,is_sale_report = is_sale_report
        ,p_type = p_type
        ,p_tag = p_tag
        ,sku_lst = [sku_str,]
    )

    return prod_bus_assoc

def exe_master( \
     name
    ,price
    ,crv
    ,is_taxable
    ,is_sale_report
    ,store_id
    ,sku_str
    ,p_type
    ,p_tag
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
        ,crv = crv
        ,is_taxable = is_taxable
        ,is_sale_report = is_sale_report
        ,store_id = store_id
        ,product = product
        ,p_type = p_type
        ,p_tag = p_tag
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


