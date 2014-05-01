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
        # TRUE,080660953014,Pacifico 6pk,5.65,7.99,1.20

        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for raw in spamreader:
            
            is_taxable_raw = raw[0]
            sku_raw = raw[1]
            name_raw = raw[2]
            price_raw = raw[3]
            cost_raw = raw[4]
            crv_raw = raw[5]

            dep_id_raw = None
            dep_raw = None
            vendor_raw = None

            if '(' in cost_raw:
                continue

            if '(' in price_raw:
                continue

            is_taxable_cook = True if is_taxable_raw == 'TRUE' else False

            try:
                buydown = None
                record(log_file = log_file,store=store,name=name_raw,sku=sku_raw,cost=cost_raw,price=price_raw,crv=crv_raw,is_taxable=is_taxable_cook,vendor=vendor_raw,buydown = buydown)
            except:
                log_file.write('there is problem with sku: ' + sku_raw)

    log_file.close() # you can omit in most cases as the destructor will call if


def record(log_file,store,name,sku,cost,price,crv,is_taxable,vendor,buydown):
    sku,is_created = Sku.objects.get_or_create(sku=sku,defaults={'is_approved':False})
    if is_created:
        new_sp_inserter.exe(
             store_id=store.id
            ,name=name
            ,price=price
            ,crv=crv
            ,is_taxable=is_taxable
            ,is_sale_report=True
            ,p_type=None
            ,p_tag=None
            ,sku_str=sku
            ,cost=cost
            ,vendor=vendor
            ,buydown = buydown
        )
    else:
        product_set = sku.product_set.all()
        if len(product_set) == 0:
            log_file.write('sku without product in our system:' + sku + '\n') # python will convert \n to os.linesep
        elif len(product_set) > 1:
            log_file.write('sku with many product in our system:' + sku + '\n')
        else:
            product = product_set[0]
            try:
                sp = Store_product.objects.get(product_id=product.id,store_id=store.id)
            except Store_product.DoesNotExist:
                old_sp_inserter.exe(
                     product_id=product.id
                    ,store_id=store.id
                    ,name=name
                    ,price=price
                    ,crv=crv
                    ,is_taxable=is_taxable
                    ,is_sale_report=is_sale_report
                    ,p_type=None
                    ,p_tag=None
                    ,assoc_sku_str=sku
                    ,cost = cost
                    ,vendor = vendor
                    ,buydown = buydown
                )

