from store_product import add_sku_cm
from store.models import Store
import csv
from store_product.models import Store_product

def exe():
    store = Store.objects.get(name = "x")
    
    # Dept_ID,Description,Tax_1,itemnum,Vendor,ItemName,CRV,Price,Cost
    log_file = open('id/log','w')

    with open('id/data_tiep_alternative_sku.csv', 'rb') as csvfile:
        # Dept_ID,Description,Tax_1,itemnum,Vendor,ItemName,CRV,Quan_In_Case,Cost,Price

        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for raw in spamreader:
            
            store_id_raw = raw[0]
            old_sku_raw = raw[1]
            alternative_sku_raw = raw[2]

            sp_lst = Store_product.objects.filter(store_id=store.id,product__sku_set__sku=old_sku_raw)
            length = len(sp_lst)

            if length != 1:
                log_file.write('multiple pid for old sku raw: ' + old_sku_raw + ' - ' + str(length))
                continue
            try:
                pid = sp_lst[0].product.id
                add_sku_cm.exe(sku_str=alternative_sku_raw,product_id=pid,store_id=store.id)
            except Exception:
                log_file.write('cm exception' + 'sku_str:' + alternative_sku_raw + ' ,product_id: ' + str(pid) + ' ,store_id: ' + str(store.id) + '\n')

    log_file.close() # you can omit in most cases as the destructor will call if