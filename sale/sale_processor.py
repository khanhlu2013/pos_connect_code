from sale.couch.receipt import receipt_lst_couch_getter
from store_product import insert_new_store_product_cm,insert_old_store_product_cm,store_product_master_getter
from store_product.models import Store_product
from sale.models import Receipt,Receipt_ln
from store.models import Store
from store.couch import store_util
from product.models import Product
import datetime

def exe(store_id):
    """

        #- GET DATA TO WORK WITH
        #. get all receipt from couch to process: couch_receipt_lst
        

        #- VERIFY COUCH CREATE OFFLINE DATA
        #. based from couch_receipt_lst.receipt_ln get 3 distinct store_product list
            . iss_null_pid                      -> pid = null . make sure create_offline = true 
            . not_null_pid_iss_create_offline   -> pid !=null and create_offline = true
            . not_null_pid_not_create_offline   -> pid !=null and create_offline = false
        #. get_sp_lookup for 2 list
            . not_null_pid_iss_create_offline
            . not_null_pid_not_create_offline
        #. verify_exact
            . not_null_pid_sp_lookup 
            . not_null_pid_not_create_offline

        #- CREATE STORE PRODUCT 
        #. create old sp and old_sp_lookup
        #. create new sp and new_sp_lookup

        #- SAVE RECEIPT TO MASTER

    """

    #- GET DATA TO WORK WITH
    couch_receipt_lst = receipt_lst_couch_getter.exe(store_id)
    
    #- VERIFY COUCH CREATE OFFLINE DATA
    iss_null_pid,not_null_pid_iss_create_offline,not_null_pid_not_create_offline = get_distinct_store_product(couch_receipt_lst)
    not_null_pid_sp_lookup = get_sp_lookup(not_null_pid_iss_create_offline+not_null_pid_not_create_offline,store_id)
    verify_exact(not_null_pid_sp_lookup,not_null_pid_not_create_offline)
    exist_in_master_sp_lookup = not_null_pid_sp_lookup
    
    #- CREATE STORE PRODUCT 
    old_sp_lookup = create_old_store_product(not_null_pid_iss_create_offline,store_id)
    new_sp_lookup = create_new_store_product(iss_null_pid,store_id,couch_receipt_lst)

    #- SAVE RECEIPT TO MASTER   
    sp_lookup = new_sp_lookup + old_sp_lookup + exist_in_master_sp_lookup
    receipt_processed_count = copy_paste_receipt_from_couch_to_master(sp_lookup,couch_receipt_lst,store_id)
    return receipt_processed_count


def create_old_store_product(sp_couch_lst,store_id):
    old_sp_lookup = []
    for sp_couch in sp_couch_lst:
        product = Product.objects.get(pk=sp_couch['product_id'])

        master_sp = insert_old_store_product_cm.exe(
             product
            ,store_id
            ,sp_couch['name']
            ,sp_couch['price']
            ,sp_couch['crv']
            ,sp_couch['is_taxable']
            ,True#isTaxReport
            ,True#store_product.isSaleReport
            ,sp_couch['create_offline_by_sku']
        )       
        old_sp_lookup.append({'couch_id':sp_couch['_id'],'master_id':master_sp.id,'pid':product.id})
    return old_sp_lookup


def create_new_store_product(sp_couch_lst,store_id,receipt_lst):
    new_sp_lookup_lst = []

    for sp_couch in sp_couch_lst:
        master_sp = insert_new_store_product_cm.exe(
             sp_couch['name']
            ,sp_couch['price']
            ,sp_couch['crv']
            ,sp_couch['is_taxable']
            ,True#isTaxReport
            ,True#isSaleReport
            ,store_id
            ,sp_couch['create_offline_by_sku'])

        new_sp_lookup_lst.append({'couch_id':sp_couch['_id'],'master_id':master_sp.id,'pid':master_sp.product.id})

    return new_sp_lookup_lst


def verify_exact(lookup_lst,sp_couch_lst):
    match = True;

    if len(lookup_lst) != len(sp_couch_lst):
        raise Exception('Bug: unexpected result')

    for sp_couch in sp_couch_lst:
        match_lookup = [lookup for lookup in lookup_lst if lookup['pid'] == sp_couch['product_id']]
        l = len(match_lookup)
        if l == 0:
            match = False
            raise Exception('Bug: unexpected result is not found')
        elif l == 1:
            pass
        else:
            match = False;
            raise Exception('Bug: unexpected multiple result found')

    return match

def get_sp_lookup(sp_couch_lst,store_id):
    sp_lookup = []
    sp_master_lst = store_product_master_getter.by_pid_lst_and_store_id([sp_couch['product_id'] for sp_couch in sp_couch_lst],store_id)

    for sp_couch in sp_couch_lst:
        sp_master_match = [sp_master for sp_master in sp_master_lst if sp_master.product.id == sp_couch['product_id']]
        if len(sp_master_match) == 0:
            pass
        elif(len(sp_master_match) == 1):
            sp_lookup.append({'couch_id':sp_couch['_id'],'master_id':sp_master_match[0].id,'pid':sp_couch['product_id']})
        else:
            raise Exception('Bug: unexpected multiple result found')

    return sp_lookup

def get_distinct_store_product(receipt_lst):
    distinct_sp_lst = []

    for receipt in receipt_lst:
        for receipt_ln in receipt['ds_lst']:
            if receipt_ln['store_product'] != None and receipt_ln['store_product'] not in distinct_sp_lst:
                distinct_sp_lst.append(receipt_ln['store_product'])

    iss_null_pid = []
    not_null_pid_iss_create_offline = []
    not_null_pid_not_create_offline = []

    for sp in distinct_sp_lst:
        if sp['product_id'] == None:
            iss_null_pid.append(sp)
        elif 'create_offline' in sp:
            not_null_pid_iss_create_offline.append(sp)
        else:
            not_null_pid_not_create_offline.append(sp)

    return iss_null_pid,not_null_pid_iss_create_offline,not_null_pid_not_create_offline


def copy_paste_receipt_from_couch_to_master(sp_lookup_lst,receipt_couch_lst,store_id):
    
    #bulk create receipt
    receipt_master_lst = []
    for receipt_couch in receipt_couch_lst:
        receipt_master = Receipt(
             time_stamp = datetime.datetime.fromtimestamp(receipt_couch['time_stamp']/1000.0)
            ,collect_amount = receipt_couch['collected_amount']
            ,tax_rate = receipt_couch['tax_rate']
            ,store_id = store_id
            ,_doc_id_creator = receipt_couch['_id']
        )
        receipt_master_lst.append(receipt_master)

    Receipt.objects.bulk_create(receipt_master_lst)


    #bulk create receipt ln
    doc_id_lst = [doc['_id'] for doc in receipt_couch_lst]
    receipt_master_lst = Receipt.objects.filter(_doc_id_creator__in = doc_id_lst)#refeshing receipt_lst to get the primary key
    receipt_ln_master_lst = []
    for receipt_master in receipt_master_lst:
        temp_lst = [receipt_couch for receipt_couch in receipt_couch_lst if receipt_couch['_id'] == receipt_master._doc_id_creator]
        if len(temp_lst) !=1: raise Exception('Bug: unexpected result')
        receipt_couch = temp_lst[0]

        for receipt_ln_couch in receipt_couch['ds_lst']:
            store_product = None
            if receipt_ln_couch['store_product'] != None:
                store_product = Store_product(id = lookup_master_sp_id(receipt_ln_couch['store_product']['_id'],sp_lookup_lst))
            receipt_ln_master = Receipt_ln(
                 receipt_id = receipt_master.id
                ,qty = receipt_ln_couch['qty']
                ,store_product = store_product
                ,price = receipt_ln_couch['price']
                ,discount = receipt_ln_couch['discount']
                ,non_product_name = receipt_ln_couch['non_product_name']
            )
            receipt_ln_master_lst.append(receipt_ln_master)

    Receipt_ln.objects.bulk_create(receipt_ln_master_lst)


    #DELETE RECEIPT
    for receipt in receipt_couch_lst:
        receipt['_deleted'] = True
    db = store_util.get_store_db(store_id)
    db.update(receipt_couch_lst)


    #RETURN
    return len(receipt_master_lst)



def lookup_master_sp_id(sp_couch_id,sp_lookup_lst):
    master_sp_id = None

    for lookup in sp_lookup_lst:
        if lookup['couch_id'] == sp_couch_id:
            master_sp_id = lookup['master_id']
            break;
    if master_sp_id == None:
        raise Exception('Bug: unexpected null lookup')
    return master_sp_id





