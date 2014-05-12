from django.db import models
from store_product.models import Store_product
import csv
from helper import test_helper
from product.models import Sku,Product,ProdSkuAssoc
from store.models import Store
from store_product import new_sp_inserter,old_sp_inserter

def exe():
    store = Store.objects.get(name='x')
    
    # Dept_ID,Description,Tax_1,itemnum,Vendor,ItemName,CRV,Price,Cost
    log_file = open('log','w')

    with open('__.txt', 'rb') as csvfile:
        # Dept_ID,Description,Tax_1,itemnum,Vendor,ItemName,CRV,Quan_In_Case,Cost,Price

        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for raw in spamreader:
            
            dep_id_raw = raw[0]
            p_type_raw = raw[1]
            is_taxable_raw = raw[2]
            sku_raw = raw[3]
            vendor_raw = raw[4]
            name_raw = raw[5]
            crv_raw = raw[6]
            qty_in_case_raw = raw[7]
            cost_raw = raw[8]
            price_raw = raw[9]
            buydown = None

            if '(' in cost_raw:
                continue

            if '(' in price_raw:
                continue

            is_taxable_cook = True if is_taxable_raw == 'TRUE' else False
            is_sale_report = True

            qty_in_case_raw = float(qty_in_case_raw)

            crv = None if qty_in_case_raw == 0 else float(crv_raw) / float(qty_in_case_raw)

            buydown = None
            record(
                log_file = log_file
                ,store=store
                ,name=name_raw
                ,sku=sku_raw
                ,cost=cost_raw
                ,price=price_raw
                ,crv=crv_raw
                ,is_taxable=is_taxable_cook
                ,vendor=vendor_raw
                ,buydown = buydown
                ,p_type = p_type_raw
                ,is_sale_report = is_sale_report
            )

    log_file.close() # you can omit in most cases as the destructor will call if


def record(log_file,store,name,sku,cost,price,crv,is_taxable,vendor,buydown,p_type,is_sale_report):
    sku,is_created = Sku.objects.get_or_create(sku=sku,defaults={'is_approved':False})
    if is_created:
        new_sp_inserter.exe(
             store_id=store.id
            ,name=name
            ,price=price
            ,crv=crv
            ,is_taxable=is_taxable
            ,is_sale_report=is_sale_report
            ,p_type=p_type
            ,p_tag=None
            ,sku_str=sku
            ,cost=cost
            ,vendor=vendor
            ,buydown = buydown
        )
    else:
        product_set = sku.product_set.all()
        if len(product_set) == 0:
            log_file.write('sku without product in our system:' + sku.sku + '\n') # python will convert \n to os.linesep
        elif len(product_set) > 1:
            log_file.write('sku with many product in our system:' + sku.sku + '\n')
        else:
            product = product_set[0]
            try:
                sp = Store_product.objects.get(product_id=product.id,store_id=store.id)
                new_sp_inserter.exe(
                     store_id=store.id
                    ,name=name
                    ,price=price
                    ,crv=crv
                    ,is_taxable=is_taxable
                    ,is_sale_report=is_sale_report
                    ,p_type=p_type
                    ,p_tag=None
                    ,sku_str=sku
                    ,cost=cost
                    ,vendor=vendor
                    ,buydown = buydown
                )                
            except Store_product.DoesNotExist:
                old_sp_inserter.exe(
                     product_id=product.id
                    ,store_id=store.id
                    ,name=name
                    ,price=price
                    ,crv=crv
                    ,is_taxable=is_taxable
                    ,is_sale_report=is_sale_report
                    ,p_type=p_type
                    ,p_tag=None
                    ,assoc_sku_str=sku
                    ,cost = cost
                    ,vendor = vendor
                    ,buydown = buydown
                )


