from store_product import new_sp_inserter,old_sp_inserter
from product.models import Sku,Product,ProdSkuAssoc
from store.models import Store
import csv
import json
from django.db import IntegrityError

store = Store.objects.get(name='y')
file_name = './id/data_full_long.txt'


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
                    print('new_sp_inserter ' + dic["name"])
                    new_sp_inserter.exe(
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
                        raise Exception
                    except Exception:
                        log_error_single.write('ERROR: insert old error anyway: ' + 'pid: ' + str(dic['pid']) + ' ,sku: ' + dic['sku'] + ', name: ' + dic['name'] + '\n')    
                
                elif is_exe == '0\n':
                    print('new_sp_inserter ' + dic['name'])
                    new_sp_inserter.exe(
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





def exe():
    # "PID-1","010986002226","Kenwood Cab 750ml","14.99","0","1","Liquors","Red Wine","11.67"
    # pid,sku,name,price,crv,is_taxable,p_type,p_tag,cost
    store = Store.objects.get(name='y')
    master_data = {}
    with open(file_name, 'rb') as f:
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
            raise Exception
        elif len(cust_sku_lst) == 1:
            sku = cust_sku_lst[0]
            our_prod_sku_assoc_lst = ProdSkuAssoc.objects.filter(sku__sku = sku)
            
            if len(our_prod_sku_assoc_lst) == 0:
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
                    vendor = None,
                    buydown = None
                ) 
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
            prod_sku_assoc_lst = ProdSkuAssoc.objects.filter(sku__sku__in = cust_sku_lst)
            pid_lst = []
            for prod_sku_assoc in prod_sku_assoc_lst:
                if prod_sku_assoc.product.id not in pid_lst:
                    pid_lst.append(prod_sku_assoc.product.id)

            if len(pid_lst) > 1:
                log_error_main.write('customer product with many customer sku. these customer sku assoc with many pid in our system. we ignore this case. Cust pid: ' + str(cust_pid) +'\n')
                continue

            a_sku = cust_sku_lst.pop()
            sp = None

            if len(pid_lst) == 1:
                sp = old_sp_inserter.exe(
                    product_id = pid_lst[0],
                    store_id = store.id,
                    name=name,
                    price=price,
                    value_customer_price=None,
                    crv=crv,
                    is_taxable=is_taxable,
                    is_sale_report=True,
                    p_type = p_type,
                    p_tag = p_tag,
                    assoc_sku_str = a_sku,
                    cost = cost,
                    vendor = None,
                    buydown = None
                )
            elif len(pid_lst == 0):
                sp = new_sp_inserter.exe(
                    store_id = store.id,
                    name = name,
                    price = price,
                    value_customer_price = None,
                    crv = crv,
                    is_taxable = is_taxable,
                    is_sale_report = True,
                    p_type = p_type,
                    p_tag = p_tag,
                    sku_str = a_sku,
                    cost = cost,
                    vendor = None,
                    buydown = None
                ) 

            for sku in cust_sku_lst:
                sku_obj,is_created = Sku.objects.get_or_create(sku=sku,defaults={'creator_id':store.id,'is_approved':False,})
                prod_sku_assoc,is_created = ProdSkuAssoc.objects.get_or_create(sku_id=sku_obj.id,product=sp.product,defaults={'creator_id':store.id,'is_approve_override':False})
                prod_sku_assoc.store_product_set.add(sp)

    log_data_single.close()
    log_data_multiple.close()
    log_error_main.close()

