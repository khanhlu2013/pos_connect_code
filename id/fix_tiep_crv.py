import csv
from store_product.models import Store_product
from store_product.sp_couch import store_product_couch_getter
from store.models import Store
from couch import couch_util

def exe():
    """
        for each line in _.txt
        if qty_per_case != 1 and qty_per_case != 0 and crv != 0 -> fix crv
    """
    print('fix tiep crv')
    store = Store.objects.get(name='x')
    couch_db = couch_util.get_store_db(store.id)

    # Dept_ID,Description,Tax_1,itemnum,Vendor,ItemName,CRV,Price,Cost
    log_file = open('id/log','w')

    with open('_.txt', 'rb') as csvfile:
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

            crv = None
            try:
                qty_per_case = float(qty_in_case_raw)
                crv_pack = float(crv_raw)
                if qty_per_case == 0 or qty_per_case == 1 or crv_pack == 0.0:
                    continue
                crv = round(crv_pack / qty_per_case,2)
            except Exception:
                log_file.write('parse float - exception - ' + name_raw + '\n')

            change_crv(name_raw,store.id,crv,log_file,couch_db)

    log_file.close() # you can omit in most cases as the destructor will call if    


def change_crv(name,store_id,crv,log_file,couch_db):
    sp_master = None
    sp_couch = None

    print(name)
    print(crv)

    try:
        sp_master = Store_product.objects.get(name=name,store_id=store_id)
    except Exception:
        log_file.write('get master - exception - ' + name + '\n')
    if sp_master == None:
        return

    sp_couch = store_product_couch_getter.exe(store_id = store_id,product_id = sp_master.product.id)
    if sp_couch == None:
        log_file.write('get couch - exception - ' + name + '\n')
        return

    print(name)
    print(crv)

    sp_master.crv = crv
    sp_master.save()

    sp_couch['crv'] = crv
    couch_db.save(sp_couch)



