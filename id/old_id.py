from store_product import old_sp_inserter
from store_product.cm import insert_new
from product.models import Sku,Product,ProdSkuAssoc
from store.models import Store
import csv
import json
from django.db import IntegrityError

#CONFIGURATION
store = Store.objects.get(name='2')
cust_input_file_name = './id/data_long_product_full.txt'
#END CONFIGURATION


END_OF_RECORD = '-----'
END_OF_MULTIPLE_SELECTION = '*_*'

def exe_multiple():
    log_error_multiple = open('./id/log_error_multiple','w')
    with open('./id/log_data_multiple', 'rb') as f:
        data = []
        for line in f:

            if line != END_OF_RECORD + '\n':
                data.append(line)
            else:
                their_system_name = data[0]
                
                index = 1

                selected_pid = None
                while True:
                    if data[index].strip() == END_OF_MULTIPLE_SELECTION:
                        break;
                    else:
                        temp = json.loads(data[index].strip())
                        index += 1
                        if temp['exe'] == 1:
                            selected_pid = temp['our_pid']

                dic = json.loads(data[index+1].strip())#this contain sp info
                if selected_pid != None:
                    print('old_sp_inserter ' + dic["name"])
                    old_sp_inserter.exe(
                        product_id = selected_pid,
                        store_id = store.id,
                        name=dic["name"],
                        price=dic["price"],
                        value_customer_price=None,
                        crv=dic["crv"],
                        is_taxable=dic["is_taxable"],
                        is_sale_report=True,
                        p_type = dic["p_type"],
                        p_tag = dic["p_tag"],
                        assoc_sku_str = dic['sku'],
                        cost = dic['cost'],
                        vendor = None,
                        buydown = None
                    )
                else:
                    print('insert_new ' + dic["name"])
                    insert_new.exe(
                        store_id = store.id,
                        name = dic['name'],
                        price = dic['price'],
                        value_customer_price = None,
                        crv = dic['crv'],
                        is_taxable = dic['is_taxable'],
                        is_sale_report = True,
                        p_type = dic["p_type"],
                        p_tag = dic["p_tag"],
                        sku_str = dic['sku'],
                        cost = dic['cost'],
                        vendor = None,
                        buydown = None
                    )                     

                data = []


def exe_single():
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
                    print('old_sp_inserter ' + dic['name'])
                    try:
                        old_sp_inserter.exe(
                            product_id = dic["our_pid"],
                            store_id = store.id,
                            name=dic["name"],
                            price=dic["price"],
                            value_customer_price=None,
                            crv=dic["crv"],
                            is_taxable=dic["is_taxable"],
                            is_sale_report=True,
                            p_type = dic["p_type"],
                            p_tag = dic["p_tag"],
                            assoc_sku_str = dic['sku'],
                            cost = dic['cost'],
                            vendor = None,
                            buydown = None
                        )
                    except IntegrityError:
                        log_error_single.write('INTEGRITY ERROR: ' + 'pid: ' + str(dic['our_pid']) + ' ,sku: ' + dic['sku'] + ', name: ' + dic['name'] + '\n') 
                    except Exception:
                        log_error_single.write('ERROR: insert old error anyway: ' + 'pid: ' + str(dic['our_pid']) + ' ,sku: ' + dic['sku'] + ', name: ' + dic['name'] + '\n')    
                
                elif is_exe == '0\n':
                    print('insert_new ' + dic['name'])
                    insert_new.exe(
                        store_id = store.id,
                        name = dic['name'],
                        price = dic['price'],
                        value_customer_price = None,
                        crv = dic['crv'],
                        is_taxable = dic['is_taxable'],
                        is_sale_report = True,
                        p_type = dic["p_type"],
                        p_tag = dic["p_tag"],
                        sku_str = dic['sku'],
                        cost = dic['cost'],
                        vendor = None,
                        buydown = None
                    )                   
                data = []

    log_error_single.close()   



def _group_by_pid(cust_input_file_name):
    """
        PURPOSE: 
            this method go through cust_input_file_name, which is config above to point to customer data file to be imported, return a dictionary containing 
            key(pid) and value({data:sp_info,sku_lst:a_lst_of_sku})    

        CUSTOMER DATA FORMAT
            "PID-1","010986002226","Kenwood Cab 750ml","13.99","0","1","Liquors","Red Wine","9.1"
            pid,sku,name,price,crv,is_taxable,p_type,p_tag,cost    
    """

    master_data = {}
    with open(cust_input_file_name, 'rb') as f:
        line = csv.reader(f, delimiter=',', quotechar='"')
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

            if pid not in master_data:
                data = {
                    "name" : name,
                    "price" : price,
                    "crv" : crv,
                    "is_taxable" : is_taxable,
                    "p_type" : p_type,
                    "p_tag" : p_tag,
                    "cost" : cost
                }
                cur_prod = {
                    "data" : data,
                    "sku_lst" : [sku,]
                }
                master_data[pid] = cur_prod
            else:
                if sku not in master_data[pid]['sku_lst']:
                    master_data[pid]['sku_lst'].append(sku)    

    return master_data;



def exe():
    """
        DESC: import procedure start with exe()
    """


    master_data = _group_by_pid(cust_input_file_name=cust_input_file_name)

    log_data_single = open('./id/log_data_single','w')
    log_data_multiple = open('./id/log_data_multiple','w')
    log_error_main = open('./id/log_error_main','w')

    for cust_pid in master_data:#we loop through group_by pid dictionary from customer file
        data = master_data[cust_pid]['data']
        cust_sku_lst = master_data[cust_pid]['sku_lst']

        name = data['name']
        price = data['price']
        crv = data['crv']
        is_taxable = data['is_taxable']
        p_type = None if data['p_type'] == 'NULL' else data['p_type']
        p_tag = None if data['p_tag'] == 'NULL' else data['p_tag']
        cost = data['cost']

        if len(cust_sku_lst) == 0:
            raise Exception #this should not happen because if sku is emtpy, we skip them in the _group_by_pid process
        elif len(cust_sku_lst) == 1:
            sku = cust_sku_lst[0]
            our_prod_sku_assoc_lst = ProdSkuAssoc.objects.filter(sku__sku = sku).exclude(product__creator = store)
            
            if len(our_prod_sku_assoc_lst) == 0:
                try:
                    insert_new.exe(
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
                        vendor = None,
                        buydown = None
                    ) 
                except Exception:
                    log_error_main.write('erro - insert new when we dont have sku - ' + cust_pid + ',' + sku + ',' + name + ',' + str(price) + ',' + str(crv) + '\n')

            elif len(our_prod_sku_assoc_lst) == 1:
                prod_sku_assoc = our_prod_sku_assoc_lst[0]
                our_system_name = str(prod_sku_assoc.product)
                their_system_name = name
                log_data_single.write(their_system_name + '\n')
                log_data_single.write(our_system_name + '\n')
                log_data_single.write("1" + '\n')
                dic = {
                    "our_pid" : prod_sku_assoc.product.id,
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

            else:# customer only has 1 sku, and that sku assoc with multiple pid in our system, we need to log into multiple file and select which our pid we want to use
                their_system_name = name
                log_data_multiple.write(their_system_name + '\n')
                for our_prod_sku_assoc in our_prod_sku_assoc_lst:
                    multiple_choice = {"exe" : 0,"name" : str(our_prod_sku_assoc.product),"our_pid": our_prod_sku_assoc.product.id}
                    log_data_multiple.write(json.dumps(multiple_choice) + '\n' )
                log_data_multiple.write(END_OF_MULTIPLE_SELECTION + '\n')                    
                dic = {
                    "sku" : sku,
                    "name" : name,
                    "price" : price,
                    "crv" : crv,
                    "is_taxable" : is_taxable,
                    "p_type" : p_type,
                    "p_tag" : p_tag,
                    "cost" : cost
                }                
                log_data_multiple.write(json.dumps(dic) + '\n')
                log_data_multiple.write(END_OF_RECORD + '\n')

        else:# customer product has multiple sku
            
            #cust_sku_lst containing multiple sku, and we are looking up those customer sku to see how many corresponding distict pid in our system.
            our_distinct_pid_lst = []
            prod_sku_assoc_lst = ProdSkuAssoc.objects.filter(sku__sku__in = cust_sku_lst).exclude(product__creator=store)
            for prod_sku_assoc in prod_sku_assoc_lst:
                if prod_sku_assoc.product.id not in our_distinct_pid_lst:
                    our_distinct_pid_lst.append(prod_sku_assoc.product.id)

            #customer product have multiple sku which associate with multiple pid in our system. TOO complicated, we skill this case
            if len(our_distinct_pid_lst) > 1:
                log_error_main.write('erro - customer product with many customer sku. these customer sku assoc with many pid in our system. we ignore this case. Cust pid: ' + str(cust_pid) +'\n')
                continue

            #at this code point, len(cust_sku_lst) >0 , and these multiple sku associate with at most one pid in our system: much easier to deal with now
            a_paticular_sku = None
            sp = None
            if len(our_distinct_pid_lst) == 1:
                #if in our system, we can find one pid (and there is atmost one in this point in code) that assoc with 'cust_sku_lst', there must exist 'a_paticular_sku' in 'cust_sku_lst' that also exist in our system.
                #lets find that a_paticulat_sku
                for a_cust_sku in cust_sku_lst:
                    try:
                        ProdSkuAssoc.objects.get(product_id=our_distinct_pid_lst[0],sku__sku=a_cust_sku)                        
                        a_paticular_sku = a_cust_sku
                        cust_sku_lst.remove(a_paticular_sku)
                        break
                    except ProdSkuAssoc.DoesNotExist:
                        continue
                if a_paticular_sku == None:
                    raise Exception

                #after we find that a_particular_sku that exist in our system, lets use that sku and insert old that single pid in our system    
                sp = old_sp_inserter.exe(
                    product_id = our_distinct_pid_lst[0],
                    store_id = store.id,
                    name=name,
                    price=price,
                    value_customer_price=None,
                    crv=crv,
                    is_taxable=is_taxable,
                    is_sale_report=True,
                    p_type = p_type,
                    p_tag = p_tag,
                    assoc_sku_str = a_paticular_sku,
                    cost = cost,
                    vendor = None,
                    buydown = None
                )
                log_error_main.write('warn - multiple sku - insert old' +'\n')
            elif len(our_distinct_pid_lst) == 0:
                #we can not find any pid in our system at assoc with 'cust_sku_lst' . 'a_paticular_sku' can be any sku and we going to use this to add new to our system
                a_paticular_sku = cust_sku_lst.pop() 
                sp = insert_new.exe(
                    store_id = store.id,
                    name = name,
                    price = price,
                    value_customer_price = None,
                    crv = crv,
                    is_taxable = is_taxable,
                    is_sale_report = True,
                    p_type = p_type,
                    p_tag = p_tag,
                    sku_str = a_paticular_sku,
                    cost = cost,
                    vendor = None,
                    buydown = None
                ) 
                log_error_main.write('warn - multiple sku - insert new' +'\n')
            #we found a_particular_sku that exist in our system, the rest of sku in 'cust_sku_lst' (we already pop a_particular_sku and took care of it) are going to be taking care here
            for sku in cust_sku_lst:
                sku_obj,is_created = Sku.objects.get_or_create(sku=sku,defaults={'creator_id':store.id,'is_approved':False,})
                prod_sku_assoc,is_created = ProdSkuAssoc.objects.get_or_create(sku_id=sku_obj.id,product=sp.product,defaults={'creator_id':store.id,'is_approve_override':False})
                prod_sku_assoc.store_product_set.add(sp)

    log_data_single.close()
    log_data_multiple.close()
    log_error_main.close()


