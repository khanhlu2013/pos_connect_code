from store_product.models import Store_product
from product.models import ProdSkuAssoc,Product
from store_product.couch.models import Product_document
from store_product.couch import store_product_couch_getter
from util.couch import couch_constance
from store.couch import store_util
from django.conf import settings
from util.couch import couch_util
from django.db import IntegrityError


def exe(
     product_id
    ,business_id
    ,name
    ,price
    ,crv
    ,isTaxable
    ,isTaxReport
    ,isSaleReport
    ,assoc_sku_str 
    ,p_type = None
    ,p_tag = None
):

    prod_bus_assoc = exe_master( \
         product_id
        ,business_id
        ,name
        ,price
        ,crv
        ,isTaxable
        ,isTaxReport
        ,isSaleReport
        ,assoc_sku_str
        ,p_type
        ,p_tag
    )

    product = Product.objects.prefetch_related('prodskuassoc_set__store_product_lst').get(pk=product_id)
    exe_couch( \
         name
        ,price
        ,crv
        ,isTaxable
        ,business_id
        ,product_id
        ,assoc_sku_str = assoc_sku_str 
        ,approved_sku_lst = [sku.sku for sku in product.sku_lst.all() if sku.is_approved] #we only add approved sku
    )

    return prod_bus_assoc

def exe_master(
     product_id
    ,business_id
    ,name
    ,price
    ,crv
    ,isTaxable
    ,isTaxReport
    ,isSaleReport
    ,assoc_sku_str
    ,p_type
    ,p_tag
):

    prod_bus_assoc = Store_product.objects.create( \
         product_id = product_id
        ,business_id = business_id
        ,name = name
        ,price = price
        ,crv = crv
        ,isTaxable = isTaxable
        ,isTaxReport = isTaxReport
        ,isSaleReport = isSaleReport 
        ,p_type = p_type
        ,p_tag = p_tag
    )

    prod_sku_assoc = ProdSkuAssoc.objects.get(product_id=product_id,sku__sku=assoc_sku_str)
    prod_sku_assoc.store_product_lst.add(prod_bus_assoc);

    return prod_bus_assoc

def exe_couch(
     name
    ,price
    ,crv
    ,isTaxable
    ,business_id
    ,product_id
    ,assoc_sku_str
    ,approved_sku_lst):

    store_product = store_product_couch_getter.exe(product_id,business_id)
    db = store_util.get_store_db(business_id)

    if store_product != None:
        #this product should not exist in couch. 
        raise IntegrityError()
    else:
        #prepare sku_lst for doc
        sku_lst = [sku for sku in approved_sku_lst]
        if not assoc_sku_str in approved_sku_lst:
            sku_lst.append(assoc_sku_str)   
        
        #create document
        store_product = Product_document(
             d_type = couch_constance.STORE_PRODUCT_DOCUMENT_TYPE
            ,name = name
            ,price = couch_util.number_2_str(price)
            ,crv = couch_util.number_2_str(crv)
            ,is_taxable = isTaxable
            ,sku_lst = sku_lst
            ,business_id = business_id
            ,product_id  = product_id
        )
        store_product.store(db)


