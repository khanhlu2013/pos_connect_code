from store_product.cm import add_sku_cm,sp_kit_update_cm
from store.models import Store
import csv
from store_product.models import Store_product
from store_product import sp_updator
def exe():
    store = Store.objects.get(name = "x")
    
    # Dept_ID,Description,Tax_1,itemnum,Vendor,ItemName,CRV,Price,Cost
    log_file = open('id/log','w')

    with open('id/data_tiep_kit.csv', 'rb') as csvfile:
        # Dept_ID,Description,Tax_1,itemnum,Vendor,ItemName,CRV,Quan_In_Case,Cost,Price

        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for raw in spamreader:
            
            kit_sku_raw = raw[0]
            xxx_raw = raw[1]
            bd_sku_raw = raw[2]
            bd_qty_raw = raw[3]
            kit_price_raw = raw[4]

            try:
                kit = Store_product.objects.get(store_id=store.id,product__sku_set__sku=kit_sku_raw)
                bd = Store_product.objects.get(store_id=store.id,product__sku_set__sku=bd_sku_raw)

                sp_updator.exe(
                     product_id=kit.product.id
                    ,store_id=store.id
                    ,name = kit.name
                    ,price = kit_price_raw
                    ,value_customer_price = None
                    ,crv = None
                    ,is_taxable = kit.is_taxable
                    ,is_sale_report = kit.is_sale_report
                    ,p_type = kit.p_type
                    ,p_tag = kit.p_tag
                    ,vendor = kit.vendor
                    ,cost = None
                    ,buydown = None
                )

                sp_kit_update_cm.exe(kit_id=kit.product.id,store_id=store.id,assoc_json_lst=[{'product_id':bd.product.id,'qty':bd_qty_raw}])
            except:
                log_file.write('can not find kit - bd : ' + kit_sku_raw + ' - ' + bd_sku_raw  + '\n')

    log_file.close() # you can omit in most cases as the destructor will call if


def exe_dup():
    result = {}

    with open('id/data_tiep_kit.csv', 'rb') as csvfile:
        # Dept_ID,Description,Tax_1,itemnum,Vendor,ItemName,CRV,Quan_In_Case,Cost,Price

        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for raw in spamreader:
            
            kit_sku_raw = raw[0]
            xxx_raw = raw[1]
            bd_sku_raw = raw[2]
            bd_qty_raw = raw[3]
            kit_price_raw = raw[4]    

            if kit_sku_raw in result:
                result[kit_sku_raw] +=1
            else:
                result[kit_sku_raw] = 1

    for item in result:
        if result[item] != 1:
            print(item + ' - ' + str(result[item]))


