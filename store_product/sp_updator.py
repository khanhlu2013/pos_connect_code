from store_product.sp_couch import store_product_couch_getter
from store_product.models import Store_product
from couch import couch_util

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
    ,vendor
    ,cost
    ,buydown
):

    sp = exe_master( \
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
        ,vendor = vendor
        ,cost = cost
        ,buydown = buydown
    )

    exe_couch(\
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
        ,vendor = vendor
        ,cost = cost
        ,buydown = buydown
    )
    return sp

def exe_couch(
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
    ,vendor 
    ,cost
    ,buydown
):
    #retrieve
    sp = store_product_couch_getter.exe(product_id,store_id)
    
    #update
    sp['name'] = name
    sp['price'] = couch_util.decimal_2_str(price)
    sp['value_customer_price'] = couch_util.decimal_2_str(value_customer_price)
    sp['crv'] = couch_util.decimal_2_str(crv)
    sp['is_taxable'] = is_taxable
    sp['is_sale_report'] = is_sale_report
    sp['p_type'] = p_type
    sp['p_tag'] = p_tag
    sp['vendor'] = vendor
    sp['cost'] = cost
    sp['buydown'] = buydown

    #save
    db = couch_util.get_store_db(store_id)
    db.save(sp)

def exe_master( \
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
    ,vendor
    ,cost
    ,buydown
):

    sp = Store_product.objects.get(product_id=product_id,store_id=store_id)
    sp.name = name
    sp.price = price
    sp.value_customer_price = value_customer_price
    sp.crv = crv
    sp.is_taxable = is_taxable
    sp.p_type = p_type
    sp.p_tag = p_tag
    sp.is_sale_report = is_sale_report
    sp.vendor = vendor
    sp.cost = cost
    sp.buydown = buydown
    sp.save()

    return sp