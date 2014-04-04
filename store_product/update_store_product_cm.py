from store_product.sp_couch import store_product_couch_getter
from store_product.models import Store_product
from couch import couch_util

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
):

    sp = exe_master( \
         product_id
        ,store_id
        ,name
        ,price
        ,crv
        ,is_taxable
        ,is_sale_report
        ,p_type
        ,p_tag
    )

    exe_couch(\
         product_id
        ,store_id
        ,name
        ,price
        ,crv
        ,is_taxable
        ,is_sale_report
        ,p_type
        ,p_tag
    )
    return sp

def exe_couch(
     product_id
    ,store_id
    ,name
    ,price
    ,crv
    ,is_taxable
    ,is_sale_report
    ,p_type
    ,p_tag
):

    #retrieve
    couch_prod_bus_assoc = store_product_couch_getter.exe(product_id,store_id)
    
    #update
    couch_prod_bus_assoc['name'] = name
    couch_prod_bus_assoc['price'] = couch_util.number_2_str(price)
    couch_prod_bus_assoc['crv'] = couch_util.number_2_str(crv)
    couch_prod_bus_assoc['is_taxable'] = is_taxable
    couch_prod_bus_assoc['is_sale_report'] = is_sale_report
    couch_prod_bus_assoc['p_type'] = p_type
    couch_prod_bus_assoc['p_tag'] = p_tag


    #save
    db = couch_util.get_store_db(store_id)
    db.save(couch_prod_bus_assoc)

def exe_master( \
     product_id
    ,store_id
    ,name
    ,price
    ,crv
    ,is_taxable
    ,is_sale_report
    ,p_type
    ,p_tag
):

    rel_prod_bus_assoc = Store_product.objects.get(product_id=product_id,store_id=store_id)
    rel_prod_bus_assoc.name = name
    rel_prod_bus_assoc.price = price
    rel_prod_bus_assoc.crv = crv
    rel_prod_bus_assoc.is_taxable = is_taxable
    rel_prod_bus_assoc.p_type = p_type
    rel_prod_bus_assoc.p_tag = p_tag
    rel_prod_bus_assoc.is_sale_report = is_sale_report

    rel_prod_bus_assoc.save()

    return rel_prod_bus_assoc