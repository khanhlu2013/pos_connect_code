from product.models import Sku,Product,ProdSkuAssoc
from store.models import Store
import csv
import json
from django.db import IntegrityError
from store_product.cm import insert_new,insert_old

#CONFIGURATION
store = Store.objects.get(name='3')
cust_input_file_name = './id/data_barel_product_full.txt'
#END CONFIGURATION


END_OF_RECORD = '-----'
END_OF_MULTIPLE_SELECTION = '*_*'

"""
    . multiple log: customer have a pid and that pid only have 1 sku. ( we import alternative sku later) That one customer sku assoc with many pid in our system. so we need to pick on, or none to create new product sharing same sku.
    . single log: customer have 1 sku and that sku assoc with 1 pid in our system. a common mistake would be : what the hell are you waiting for? go ahead and use that pid, there is only 1. but wait, that one pid in our system could represent many products in customer system. in this case, we must create a new pid to import customer product because we need to keep these product from customer system separate the same way they originally have - not the way we are having: combinging products.
"""

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
                        break
                    else:
                        temp = json.loads(data[index].strip())
                        index += 1
                        if temp['exe'] == 1:
                            selected_pid = temp['our_pid']

                dic = json.loads(data[index+1].strip())#this contain sp info
                if selected_pid != None:
                    print('insert_old ' + dic["name"])
                    insert_old.exe(
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
                        buydown = dic['buydown']
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
                        buydown = dic['buydown']
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
                    print('insert_old ' + dic['name'])
                    try:
                        insert_old.exe(
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
                            buydown = dic['buydown']
                        )
                    except IntegrityError:
                        log_error_single.write('INTEGRITY ERROR: ' + 'pid: ' + str(dic['our_pid']) + ' ,sku: ' + dic['sku'] + ', name: ' + dic['name'] + '\n') 
                    except Exception:
                        log_error_single.write('ERROR: insert old error anyway: ' + 'pid: ' + str(dic['our_pid']) + ' ,sku: ' + dic['sku'] + ', name: ' + dic['name'] + '\n')    
                
                elif is_exe == '0\n':
                    print('insert_new ' + dic['name'])
                    try:
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
                            buydown = dic['buydown']
                        )  
                    except Exception:
                        log_error_single.write('ERROR: insert old error anyway: ' + 'pid: ' + str(dic['our_pid']) + ' ,sku: ' + dic['sku'] + ', name: ' + dic['name'] + '\n')                   
                data = []

    log_error_single.close()   

def _group_by_pid(cust_input_file_name):
    """
        PURPOSE: 
            this method go through cust_input_file_name, which is config above to point to customer data file to be imported, return a dictionary containing 
            key(pid) and value({data:sp_info,sku_lst:a_lst_of_sku})    

        CUSTOMER DATA FORMAT
            pid,sku,name,price,tag_along_sku,tag_along_name,tag_along_amount,is_taxable,p_type,p_tag,cost    
    """

    cust_dic = {}
    with open(cust_input_file_name, 'rb') as f:
        # line = csv.reader(f, delimiter=',', quotechar='"')
        line = csv.reader(f, delimiter=',')
        for raw in line:
            pid = raw[0]
            sku = raw[1].strip()
            name = raw[2]
            price = float(raw[3])

            tag_along_sku = raw[4]
            tag_along_name = raw[5]
            try:
                tag_along_amount = float(raw[6])
            except:
                tag_along_amount = None

            is_taxable = True if raw[7] == 'TRUE' else False
            p_type = raw[8]
            p_tag = raw[9]
            try:
                cost = float(raw[10])
            except:
                cost = None
            
            crv = None
            buydown = None

            if len(sku) == 0 or price < 0:
                continue

            if 'crv' in tag_along_sku.lower():
                crv = tag_along_amount
            elif 'dis' in tag_along_sku.lower():
                buydown = abs(tag_along_amount)

            if pid not in cust_dic:
                data = {
                    "name" : name,
                    "price" : price,
                    "crv" : crv,
                    "is_taxable" : is_taxable,
                    "p_type" : p_type,
                    "p_tag" : p_tag,
                    "cost" : cost,
                    "buydown" : buydown
                }
                cur_prod = {
                    "data" : data,
                    "sku_lst" : [sku,]
                }
                cust_dic[pid] = cur_prod
            else:
                if sku not in cust_dic[pid]['sku_lst']:
                    cust_dic[pid]['sku_lst'].append(sku)    

    return cust_dic

def _is_use_our_pid_when_cust_pid_have_1_sku_and_that_sku_assoc_with_1_our_pid(cust_pid,cust_sku,cust_dic,our_pid):
    """
        there are 2 case that we are not using our pid

            . case1: customer have many product each have a sku. we only have 1 product containing all these sku

                cust_pid_1 (jacklin original)  <--->  sku_1  <--->
                cust_pid_2 (jacklin peperoni)  <--->  sku_2  <--->   our_pid (jackin) 
                cust_pid_3 (jacklin terayaki)  <--->  sku_3  <--->


            . case2: customer have many product sharing a same sku. we have only 1 product with that sku

                cust_pid_1 (sierra nevada tumbler)  <--->
                cust_pid_2 (sierra nevada topedo_)  <--->  sku  <--->  our_pid (sierra nevada)
                cust_pid_3 (sierra nevada ruthles)  <--->

    """
    our_product = Product.objects.prefetch_related('sku_set').get(pk=our_pid)
    our_sku_lst = [sku_obj.sku for sku_obj in our_product.sku_set.all()]

    if len(our_sku_lst) == 0:
        raise Exception
    else:
        is_use_our_pid = True
        for temp_cust_pid in cust_dic:
            if temp_cust_pid == cust_pid:#we are just going to verify data integrity here, and raise exception if need
                if len(cust_dic[temp_cust_pid]['sku_lst']) != 1 and cust_dic[temp_cust_pid]['sku_lst'][0] != cust_sku:
                    raise Exception
                else:
                    continue
            else:
                lst = [i for i in cust_dic[temp_cust_pid]['sku_lst'] if i in our_sku_lst]#if 'other' customer product ('other' vs curreny cust_pid product that we are looking at) have sku that exist in our_pid product, this case mean that we have a product that combine multiple product from the customer. this is case 1
                if len(lst) != 0:
                    is_use_our_pid = False
                    break
        return is_use_our_pid

def _cus_sku_lst_is_1(
         cust_sku
        ,cust_pid
        ,cust_name
        ,cust_price
        ,cust_crv
        ,cust_is_taxable
        ,cust_p_type
        ,cust_p_tag
        ,cust_cost
        ,cust_buydown
        ,log_error_main
        ,log_data_single
        ,log_data_multiple
        ,cust_dic
):
    our_prod_sku_assoc_lst = ProdSkuAssoc.objects.filter(sku__sku = cust_sku).exclude(product__creator = store)
    
    if len(our_prod_sku_assoc_lst) == 0:
        try:
            insert_new.exe(
                store_id = store.id,
                name = cust_name,
                price = cust_price,
                value_customer_price = None,
                crv = cust_crv,
                is_taxable = cust_is_taxable,
                is_sale_report = True,
                p_type = cust_p_type,
                p_tag = cust_p_tag,
                sku_str = cust_sku,
                cost = cust_cost,
                vendor = None,
                buydown = cust_buydown
            ) 
        except Exception:
            log_error_main.write('erro - insert new when we dont have sku - ' + cust_pid + ',' + cust_sku + ',' + cust_name + ',' + str(cust_price) + ',' + str(cust_crv) + '\n')

    elif len(our_prod_sku_assoc_lst) == 1:
        our_prod_sku_assoc = our_prod_sku_assoc_lst[0]
        our_name = str(our_prod_sku_assoc.product)
        our_pid = our_prod_sku_assoc.product.id
        is_use_our_pid = _is_use_our_pid_when_cust_pid_have_1_sku_and_that_sku_assoc_with_1_our_pid(cust_pid,cust_sku,cust_dic,our_pid)
        log_data_single.write(cust_name + '\n')
        log_data_single.write(our_name + '\n')
        log_data_single.write( ("1" if is_use_our_pid else "0") + '\n')
        dic = {
            "our_pid" : our_pid,
            "sku" : cust_sku,
            "name" : cust_name,
            "price" : cust_price,
            "crv" : cust_crv,
            "is_taxable" : cust_is_taxable,
            "p_type" : cust_p_type,
            "p_tag" : cust_p_tag,
            "cost" : cust_cost,
            "buydown" : cust_buydown
        }
        log_data_single.write(json.dumps(dic) + '\n')
        log_data_single.write(END_OF_RECORD + '\n')

    else:# customer only has 1 sku, and that sku assoc with multiple pid in our system, we need to log into multiple file and select which our pid we want to use
        log_data_multiple.write(cust_name + '\n')
        for our_prod_sku_assoc in our_prod_sku_assoc_lst:
            multiple_choice = {"exe" : 0,"name" : str(our_prod_sku_assoc.product),"our_pid": our_prod_sku_assoc.product.id}
            log_data_multiple.write(json.dumps(multiple_choice) + '\n' )
        log_data_multiple.write(END_OF_MULTIPLE_SELECTION + '\n')                    
        dic = {
            "sku" : cust_sku,
            "name" : cust_name,
            "price" : cust_price,
            "crv" : cust_crv,
            "is_taxable" : cust_is_taxable,
            "p_type" : cust_p_type,
            "p_tag" : cust_p_tag,
            "cost" : cust_cost,
            "buydown" : cust_buydown
        }                
        log_data_multiple.write(json.dumps(dic) + '\n')
        log_data_multiple.write(END_OF_RECORD + '\n')




def exe():
    """
        DESC: import procedure start with exe()
    """


    cust_dic = _group_by_pid(cust_input_file_name=cust_input_file_name)

    log_data_single = open('./id/log_data_single','w')
    log_data_multiple = open('./id/log_data_multiple','w')
    log_error_main = open('./id/log_error_main','w')

    for cust_pid in cust_dic:#we loop through group_by pid dictionary from customer file
        cust_data = cust_dic[cust_pid]['data']
        cust_sku_lst = cust_dic[cust_pid]['sku_lst']

        cust_name = cust_data['name']
        cust_price = cust_data['price']
        cust_crv = cust_data['crv']
        cust_is_taxable = cust_data['is_taxable']
        cust_p_type = None if cust_data['p_type'] == 'NULL' else cust_data['p_type']
        cust_p_tag = None if cust_data['p_tag'] == 'NULL' else cust_data['p_tag']
        cust_cost = cust_data['cost']
        cust_buydown = cust_data['buydown']

        if len(cust_sku_lst) == 0:
            raise Exception #this should not happen because if sku is emtpy, we skip them in the _group_by_pid process
        elif len(cust_sku_lst) == 1:
            _cus_sku_lst_is_1(
                cust_sku=cust_sku_lst[0],
                cust_pid = cust_pid,
                cust_name=cust_name,
                cust_price=cust_price,
                cust_crv=cust_crv,
                cust_is_taxable=cust_is_taxable,
                cust_p_type=cust_p_type,
                cust_p_tag=cust_p_tag,
                cust_cost=cust_cost,
                cust_buydown=cust_buydown,
                log_error_main=log_error_main,
                log_data_single=log_data_single,
                log_data_multiple=log_data_multiple,
                cust_dic=cust_dic
            )

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
                sp = insert_old.exe(
                    product_id = our_distinct_pid_lst[0],
                    store_id = store.id,
                    name=cust_name,
                    price=cust_price,
                    value_customer_price=None,
                    crv=cust_crv,
                    is_taxable=cust_is_taxable,
                    is_sale_report=True,
                    p_type = cust_p_type,
                    p_tag = cust_p_tag,
                    assoc_sku_str = a_paticular_sku,
                    cost = cust_cost,
                    vendor = None,
                    buydown = cust_buydown
                )
            elif len(our_distinct_pid_lst) == 0:
                #we can not find any pid in our system at assoc with 'cust_sku_lst' . 'a_paticular_sku' can be any sku and we going to use this to add new to our system
                a_paticular_sku = cust_sku_lst.pop() 
                sp = insert_new.exe(
                    store_id = store.id,
                    name = cust_name,
                    price = cust_price,
                    value_customer_price = None,
                    crv = cust_crv,
                    is_taxable = cust_is_taxable,
                    is_sale_report = True,
                    p_type = cust_p_type,
                    p_tag = cust_p_tag,
                    sku_str = a_paticular_sku,
                    cost = cust_cost,
                    vendor = None,
                    buydown = cust_buydown
                )
            #we found a_particular_sku that exist in our system, the rest of sku in 'cust_sku_lst' (we already pop a_particular_sku and took care of it) are going to be taking care here
            for sku in cust_sku_lst:
                sku_obj,is_created = Sku.objects.get_or_create(sku=sku,defaults={'creator_id':store.id,'is_approved':False,})
                prod_sku_assoc,is_created = ProdSkuAssoc.objects.get_or_create(sku_id=sku_obj.id,product=sp.product,defaults={'creator_id':store.id,'is_approve_override':False})
                prod_sku_assoc.store_product_set.add(sp)

    log_data_single.close()
    log_data_multiple.close()
    log_error_main.close()

