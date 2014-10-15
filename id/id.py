from store_product.models import Store_product,Kit_breakdown_assoc
import csv
from product.models import Sku,Product,ProdSkuAssoc
from store.models import Store
from store_product import old_sp_inserter,dao
from store_product.cm import insert_new,sp_kit_update_angular_cm


#STEP1: exe to insert unique sku
def exe():
    store = Store.objects.get(name = "1")
    
    # Dept_ID,Description,Tax_1,itemnum,Vendor,ItemName,CRV,Price,Cost
    log_file = open('id/log','w')

    with open('id/data_product_full_tiep.txt', 'rb') as csvfile:
        #Vendor,Dept_ID,Case,Case Price,ItemNum,ItemName,Cost,Price,Tax_1,Quan_In_Case,CASE-CRV,CRV

        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for raw in spamreader:
            
            vendor_raw = raw[0]
            # dep_id_raw = raw[1]
            is_kit_raw = raw[2]
            price_kit_raw = raw[3]
            sku_raw = raw[4]
            name_raw = raw[5]
            cost_raw = raw[6]
            price_bd_raw = raw[7]
            tax_raw = raw[8]
            # qty_in_case_raw = raw[9]
            # case_crv_raw = raw[10]
            crv_raw = raw[11]


            vendor_cook = vendor_raw.strip()
            vendor_cook = None if len(vendor_cook) == 0 else vendor_cook
            is_kit_cook = True if is_kit_raw.strip() == 'TRUE' else False
            price_kit_cook = float(price_kit_raw)
            sku_cook = sku_raw.strip()
            name_cook = name_raw.strip()
            cost_cook = float(cost_raw)
            cost_cook = None if cost_cook == 0 else cost_cook
            price_bd_cook = float(price_bd_raw)
            price_cook = price_bd_cook if is_kit_cook == False else price_kit_cook
            tax_cook = True if tax_raw.strip() == 'TRUE' else False
            crv_cook = float(crv_raw)
            crv_cook = None if crv_cook == 0 else crv_cook

            _record(
                 log_file = log_file
                ,store=store
                ,name=name_cook
                ,sku=sku_cook
                ,cost=cost_cook
                ,price=price_cook
                ,crv=crv_cook
                ,is_taxable=tax_cook
                ,vendor=vendor_cook
                ,buydown = None
                ,p_type = None
                ,is_sale_report = True
            )

    log_file.close() # you can omit in most cases as the destructor will call if


def exe_kit():
    log_file = open('id/log_kit','w')
    store = Store.objects.get(name = "1")
    with open('id/data_kit_full_tiep.txt', 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for raw in spamreader:
            #Kit_ID  Quantity    ItemNum ItemName    IsKit   Kit_Override
            kit_sku = raw[0].strip()
            qty = int(raw[1].strip())
            bd_sku = raw[2].strip()
            #kit_name = raw[3]
            #is_kit = raw[4]
            #kit_price = raw[5]

            kit_lst = dao.get_lst_by_sku(kit_sku,store.id)
            bd_lst = dao.get_lst_by_sku(bd_sku,store.id)
            if len(kit_lst) != 1:
                log_file.write('kit sku: ' + kit_sku + ' having len of ' + str(len(kit_lst)))
                continue

            if len(bd_lst) != 1:
                log_file.write('bd  sku: ' + bd_sku + ' having len of ' + str(len(bd_lst)))
                continue

            assoc_json = {'breakdown':{'product_id':bd_lst[0].product.id},'qty':qty}
            assoc_json_lst = [assoc_json,]

            sp_kit_update_angular_cm.exe(kit_lst[0].product.id,assoc_json_lst,store.id)

    log_file.close() 


def _record(log_file,store,name,sku,cost,price,crv,is_taxable,vendor,buydown,p_type,is_sale_report):
    sku,is_created = Sku.objects.get_or_create(sku=sku,defaults={'is_approved':False})
    if is_created:
        insert_new.exe(
             store_id=store.id
            ,name=name
            ,price=price
            ,value_customer_price = None
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
                insert_new.exe(
                     store_id=store.id
                    ,name=name
                    ,price=price
                    ,value_customer_price = None
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
                    ,value_customer_price = None
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


