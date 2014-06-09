from django.db import models
from store_product.models import Store_product
import csv
from helper import test_helper
from product.models import Sku,Product,ProdSkuAssoc
from store.models import Store
from store_product import new_sp_inserter,old_sp_inserter
from django.db import IntegrityError
import json

END_OF_RECORD = '-----'

def _form_vendor(store_id,pid):
    return str(store_id) + '_' + pid

def exe_single_file(store_id):
    log_error_single = open('./id/log_error_single','w')
    with open('./id/log_data_single', 'rb') as f:
        data = []
        for line in f:

            if line != END_OF_RECORD + '\n':
                data.append(line)
            else:
                our_system_name = data[0]
                their_system_name = data[1]
                is_exe = data[2]
                dic = json.loads(data[3])
                if is_exe == '1\n':
                    print('exe_1_ ' + dic['name'])
                    try:
                        old_sp_inserter.exe(
                            product_id = dic["pid"],
                            store_id = store_id,
                            name=dic["name"],
                            price=dic["price"],
                            value_customer_price=None,
                            crv=dic["crv"],
                            is_taxable=dic["is_taxable"],
                            is_sale_report=True,
                            p_type = None if dic["p_type"] == 'NULL' else dic["p_type"],
                            p_tag = None if dic["p_tag"] == 'NULL' else dic["p_tag"],
                            assoc_sku_str = dic['sku'],
                            cost = dic['cost'],
                            vendor = None,
                            buydown = None
                        )
                    except IntegrityError:
                        #we found out that the current sku only assoc with one product so we attemp to use this ond pid for insert. However, we got a contrain error here because previously, we process 
                        #a different sku that also assoc with this pid and we already use this pid/store combo. right now we dont need to insert this pid but update the db to say that this prod_sku_assoc
                        #is supported by this store
                        sp = Store_product.objects.get(store_id=store_id,product_id=dic['pid'])
                        prod_sku_assoc = ProdSkuAssoc.objects.get(product_id=dic['pid'],sku__sku=dic['sku'])
                        prod_sku_assoc.store_product_set.add(sp)
                        log_error_single.write('WARNING: 1 pid multiple sku : ' + 'our pid: ' + str(dic['pid']) + ' ,sku: ' + dic['sku'] + ', name: ' + dic['name'] + '\n')  


                    except Exception:
                        log_error_single.write('ERROR: insert old error anyway: ' + 'pid: ' + str(dic['pid']) + ' ,sku: ' + dic['sku'] + ', name: ' + dic['name'] + '\n')    
                elif is_exe == '0\n':
                    print('exe_0_ ' + dic['name'])
                    new_sp_inserter.exe(
                        store_id = store_id,
                        name = dic['name'],
                        price = dic['price'],
                        value_customer_price = None,
                        crv = dic['crv'],
                        is_taxable = dic['is_taxable'],
                        is_sale_report = True,
                        p_type = None if dic["p_type"] == 'NULL' else dic["p_type"],
                        p_tag = None if dic["p_tag"] == 'NULL' else dic["p_tag"],
                        sku_str = dic['sku'],
                        cost = dic['cost'],
                        vendor = None,
                        buydown = None
                    )                   
                data = []

    log_error_single.close()         


def exe():
    """
        . take a file, each line with this format: 
        pid,sku,name,price,crv,is_taxable,p_type,p_tag,cost,buydown

        . go through each line
        
        . SAME PIDL: get the current line cur_pid and see if Store_product(store_id=cur_store,vendor=store_id + '_' + cur_pid) exist. if exist verify that current line info about
            store_product matched with the found Store_product (since they have the same pid). right now i don't think prod_sku_assoc should exist because if it is, we are duplicating pid and sku in data -> raise exception.
            Otherwise, create prod_sku_assoc and add this store in
            
        . NEW PID: otherwise, based on current sku to get a list of prod_sku_assoc. there are 3 cases for prod_sku_assoc_lst.length
            . length = 0 -> (this is a new sku) create new sku, new product, new prod_sku_assoc, new store_product (with vendor = store_id + '_' + cur_pid)
            . length = 1 -> log to single_file the current line: key is product in our system (extracting from prod_sku_assoc_lst[0]), value is customer current line data
            . length > 1 -> log to multiple_file: key is the list product in our system (extracting from prod_sku_assoc_lst), value is customer data

        . load single sku to an interface and match what is the product name in our system, and what is the product name the customer gave us. check box the name that is not the same. we will create new pid for these checked line.

        . load multiple sku file. we have to select one by one here. to get the pid we want to use. we don't select, we can create new pid.    
    """

    store = Store.objects.get(name="y")
    # "PID-1","010986002226","Kenwood Cab 750ml","14.99","0","1","Liquors","Red Wine","11.67"
    # pid,sku,name,price,crv,is_taxable,p_type,p_tag,cost

    log_error_main = open('./id/log_error_main','w')
    log_data_single = open('./id/log_data_single','w')
    log_data_multiple = open('./id/log_data_multiple','w')

    with open('./id/data_full_long.txt', 'rb') as csvfile:
        line = csv.reader(csvfile, delimiter=',', quotechar='"')
        for raw in line:
            pid_raw = raw[0]
            sku_raw = raw[1]
            name_raw = raw[2]
            price_raw = raw[3]
            crv_raw = raw[4]
            is_taxable_raw = raw[5]
            p_type_raw = raw[6]
            p_tag_raw = raw[7]
            cost_raw = raw[8]

            pid = pid_raw
            sku = sku_raw.strip()
            name = name_raw
            price = 9999.99 if price_raw == 'NULL' else float(price_raw)
            crv = float(crv_raw)
            is_taxable = True if is_taxable_raw == '1' else False
            p_type = p_type_raw
            p_tag = p_tag_raw
            cost = float(cost_raw)
            
            if len(sku) == 0:
                continue

            #SAME PID
            sp = None
            try:
                sp = Store_product.objects.get(store_id=store.id,vendor = _form_vendor(store.id,pid))
            except Store_product.DoesNotExist:
                pass

            if sp != None:
                try:
                    prod_sku_assoc = ProdSkuAssoc.objects.get(product_id=sp.product.id,sku__sku=sku)
                    log_error_main.write('WARNING: duplicate pid-sku in data: ' + 'pid: ' + str(pid) + ' ,sku: ' + sku + '\n')
                    continue
                except ProdSkuAssoc.DoesNotExist:
                    sku_obj,is_create = Sku.objects.get_or_create(sku=sku,defaults={'creator_id':store.id,'is_approved':False,})
                    prod_sku_assoc = ProdSkuAssoc.objects.create(sku=sku_obj,product=sp.product,creator=store,is_approve_override=False)
                    prod_sku_assoc.store_product_set.add(sp); 
               
            else:
                #NEW PID
                prod_sku_assoc_lst = ProdSkuAssoc.objects.filter(sku__sku=sku)
                length = len(prod_sku_assoc_lst)

                if length == 0:
                    #length = 0 -> (this is a new sku) create new sku, new product, new prod_sku_assoc, new store_product (with vendor = store_id + '_' + cur_pid)
                    try:
                        new_sp_inserter.exe(
                            store_id = store.id,
                            name = name,
                            price = price,
                            value_customer_price = None,
                            crv = crv,
                            is_taxable = is_taxable,
                            is_sale_report = True,
                            p_type = p_type,
                            p_tag = p_tag,
                            sku_str = sku,
                            cost = cost,
                            vendor = _form_vendor(store.id,pid),
                            buydown = None
                        )      
                    except Exception:
                        log_error_main.write('ERROR: insert new error anyway: ' + 'pid: ' + str(pid) + ' ,sku: ' + sku + ', name: ' + name + '\n')

                elif length == 1:
                    prod_sku_assoc = prod_sku_assoc_lst[0]
                    
                    our_system_name = str(prod_sku_assoc.product)
                    their_name = name
                    # pid,sku,name,price,crv,is_taxable,p_type,p_tag,cost
                    log_data_single.write(our_system_name + '\n')
                    log_data_single.write(their_name + '\n')
                    log_data_single.write("1" + '\n')
                    dic = {
                        "pid" : prod_sku_assoc.product.id,
                        "sku" : sku,
                        "name" : name,
                        "price" : price,
                        "crv" : crv,
                        "is_taxable" : is_taxable,
                        "p_type" : p_type,
                        "p_tag" : p_tag,
                        "cost" : cost

                    }
                    log_data_single.write(json.dumps(dic) + '\n')
                    log_data_single.write(END_OF_RECORD + '\n')

                else:
                    log_data_multiple.write(str(line) + '\n')
    
    log_error_main.close()
    log_data_single.close()
    log_data_multiple.close()