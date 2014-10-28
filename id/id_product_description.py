from store_product.cm import add_sku_cm
from store.models import Store
import csv
from store_product.models import Store_product
from store_product.cm import sp_updator
from store_product import dao

def exe():
    store = Store.objects.get(name = "1")
    log_file = open('id/log','w')
    with open('id/data_tiep_product_description_full.txt', 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for raw in spamreader:
            # ItemNum,ItemName,Dept_ID,Description

            sku = raw[0]
            product_name = raw[1]
            dep_id = raw[2]
            p_type = raw[3]

            sp_lst = dao.get_lst_by_sku(sku=sku,store_id=store.id)
            for sp in sp_lst:
                if sp.p_type != p_type:
                    sp_updator.exe(
                         product_id = sp.product.id
                        ,store_id = store.id
                        ,name = sp.name
                        ,price = float(sp.price) if sp.price != None else None
                        ,value_customer_price = float(sp.value_customer_price) if sp.value_customer_price != None else None
                        ,crv = float(sp.crv) if sp.crv != None else None
                        ,is_taxable = sp.is_taxable
                        ,is_sale_report  = sp.is_sale_report
                        ,p_type = p_type
                        ,p_tag = sp.p_tag
                        ,vendor = sp.vendor
                        ,cost = float(sp.cost) if sp.cost != None else None
                        ,buydown = float(sp.buydown) if sp.buydown != None else None
                    )

    log_file.close() # you can omit in most cases as the destructor will call if

def exe_left_over():
    store = Store.objects.get(name = "1")
    with open('id/data_tiep_product_description_full.txt', 'rb') as csvfile:
        master_data = {}
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for raw in spamreader:
            # ItemNum,ItemName,Dept_ID,Description

            sku = raw[0]
            product_name = raw[1]
            dep_id = raw[2]
            p_type = raw[3]

            master_data[sku] = p_type

        print('master data length = ' + str(len(master_data)) + '\n' )
        sp_lst = Store_product.objects.filter(store=store,p_type=None)
        for sp in sp_lst:
            found = False
            for a_sku in sp.product.sku_set.all()
                if a_sku in master_data:
                    p_type = master_data[a_sku]
                    if p_type != None:
                        sp_updator.exe(
                             product_id = sp.product.id
                            ,store_id = store.id
                            ,name = sp.name
                            ,price = float(sp.price) if sp.price != None else None
                            ,value_customer_price = float(sp.value_customer_price) if sp.value_customer_price != None else None
                            ,crv = float(sp.crv) if sp.crv != None else None
                            ,is_taxable = sp.is_taxable
                            ,is_sale_report  = sp.is_sale_report
                            ,p_type = p_type
                            ,p_tag = sp.p_tag
                            ,vendor = sp.vendor
                            ,cost = float(sp.cost) if sp.cost != None else None
                            ,buydown = float(sp.buydown) if sp.buydown != None else None
                        )
                        print('exe pid: ' + str(sp.product.id) + ' - ptype: ' + p_type + '\n')
                    found = True
                    break
            if found == False:
                print('can not find p_type for pid: ' + str(sp.product.id))


 