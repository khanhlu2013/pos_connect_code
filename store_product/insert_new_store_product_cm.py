from django.conf import settings
from product.models import Product,Sku,ProdSkuAssoc
from store_product.models import Store_product
from store_product.couch.models import Product_document
from store.couch import store_util
from util.couch import couch_constance
from util.couch import couch_util

def exe( \
     name
    ,price
    ,crv
    ,isTaxable
    ,isTaxReport
    ,isSaleReport
    ,business_id
    ,sku_str):

    prod_bus_assoc = exe_master( \
         name = name
        ,price = price
        ,crv = crv
        ,isTaxable = isTaxable
        ,isTaxReport = isTaxReport
        ,isSaleReport = isSaleReport
        ,business_id = business_id
        ,sku_str = sku_str
    )
    exe_couch( \
         name = name
        ,price = price
        ,crv = crv
        ,isTaxable = isTaxable
        ,business_id = business_id
        ,product_id = prod_bus_assoc.product.id
        ,sku_str = sku_str
    )
    return prod_bus_assoc

def exe_master( \
     name
    ,price
    ,crv
    ,isTaxable
    ,isTaxReport
    ,isSaleReport
    ,business_id
    ,sku_str):

    #CREATE PRODUCT
    product = Product.objects.create(
        _name_admin = '',
        _size_admin = '',
        _unit_admin = None,
        temp_name = name,
        creator_id = business_id
    )

    #CREATE PROD_BUS_ASSOC
    prod_bus_assoc = Store_product.objects.create(
         name = name
        ,price = price
        ,crv = crv
        ,isTaxable = isTaxable
        ,isTaxReport = isTaxReport
        ,isSaleReport = isSaleReport
        ,business_id = business_id
        ,product = product
    )

    #CREATE SKU
    if sku_str:
        #CREATE/GET SKU
        sku,created = Sku.objects.get_or_create(
            sku__exact = sku_str,
            defaults={'sku':sku_str,'creator_id':business_id,'is_approved':False}
        )
        #CREATE PROD_SKU_ASSOC 
        prodSkuAssoc = ProdSkuAssoc.objects.create(
            product = product,
            sku = sku,
            creator_id = business_id,
            is_approve_override = False
        )
        #CREATE PROD_SKU_ASSOC__PROD_BUS_ASSOC
        prodSkuAssoc.store_product_lst.add(prod_bus_assoc)

    return prod_bus_assoc


def exe_couch(
     name
    ,price
    ,crv
    ,isTaxable
    ,business_id
    ,product_id
    ,sku_str):

    #prepare sku_dict_lst for doc
    sku_lst = [sku_str,]

    #create document
    document = Product_document(
         d_type = couch_constance.STORE_PRODUCT_DOCUMENT_TYPE
        ,name = name
        ,price = couch_util.number_2_str(price)
        ,crv = couch_util.number_2_str(crv)
        ,is_taxable = isTaxable
        ,sku_lst = sku_lst
        ,business_id = business_id
        ,product_id  = product_id
    )

    #save doc
    db = store_util.get_store_db(business_id)
    document.store(db)


