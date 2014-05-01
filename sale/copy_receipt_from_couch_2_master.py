from sale.sale_couch.receipt import receipt_lst_couch_getter
from sale.models import Receipt,Receipt_ln
from couch import couch_util
from store_product import new_sp_inserter
from store_product.models import Store_product
import datetime


def exe(store_id):

    #STEP1: get receipt data to process
    receipt_couch_lst = receipt_lst_couch_getter.exe(store_id)
    if len(receipt_couch_lst) == 0:
        return 0
        
    #STEP2: insert new store product
    sp_id_c2mLookup = get_sp_id_c2mLookup(receipt_couch_lst,store_id)

    #STEP3: insert receipt
    receipt_id_c2mLookup = insert_receipt_to_master(receipt_couch_lst,store_id)

    #STEP4: insert receipt ln
    insert_receipt_ln_to_master(receipt_couch_lst,receipt_id_c2mLookup,sp_id_c2mLookup)

    #STEP5: clean up sale data in couch after process
    delete_couch_receipt(receipt_couch_lst,store_id)

    return len(receipt_couch_lst)

#------------------------------------------------------------------------------------------

def delete_couch_receipt(receipt_couch_lst,store_id):
    for receipt in receipt_couch_lst:
        receipt['_deleted'] = True
    db = couch_util.get_store_db(store_id)
    db.update(receipt_couch_lst)



def insert_receipt_ln_to_master(receipt_couch_lst,receipt_id_c2mLookup,sp_id_c2mLookup):
    receipt_ln_master_lst = []

    for receipt_couch in receipt_couch_lst:
        for receipt_ln_couch in receipt_couch['ds_lst']:

            receipt_master_id = receipt_id_c2mLookup[receipt_couch['_id']]
            
            #SP
            sp_couch = receipt_ln_couch['store_product'] 
            sp_master_id = None
            sp_is_taxable = None
            sp_p_type = None
            sp_p_tag = None
            sp_cost = None
            sp_buydown = None

            if sp_couch != None:
                sp_master_id = sp_id_c2mLookup[sp_couch['_id']]
                sp_is_taxable = sp_couch['is_taxable']
                sp_p_type = sp_couch['p_type']
                sp_p_tag = sp_couch['p_tag']  
                sp_cost = sp_couch['cost']   
                sp_buydown = sp_couch['buydown']         
            else:
                sp_is_taxable = False

            #MM_DEAL
            mm_unit_discount = 0.0 if receipt_ln_couch['mix_match_deal'] == None else receipt_ln_couch['mix_match_deal']['unit_discount']


            receipt_ln_master = Receipt_ln(
                 receipt_id = receipt_master_id
                ,qty = receipt_ln_couch['qty']
                ,store_product_id = sp_master_id
                ,price = receipt_ln_couch['price']
                ,crv = sp_couch['crv']
                ,discount = receipt_ln_couch['discount']
                ,discount_mm_deal = mm_unit_discount
                ,non_product_name = receipt_ln_couch['non_product_name']
                ,is_taxable = sp_is_taxable
                ,p_type = sp_p_type
                ,p_tag = sp_p_tag
                ,cost = sp_cost
                ,buydown = sp_buydown
            )
            receipt_ln_master_lst.append(receipt_ln_master)

    Receipt_ln.objects.bulk_create(receipt_ln_master_lst)



def insert_receipt_to_master(receipt_couch_lst,store_id):
    #bulk create receipt
    receipt_master_lst = []
    for receipt_couch in receipt_couch_lst:
        receipt_master = Receipt(
             time_stamp = datetime.datetime.fromtimestamp(receipt_couch['time_stamp']/1000.0)
            ,collect_amount = receipt_couch['collect_amount']
            ,tax_rate = receipt_couch['tax_rate']
            ,store_id = store_id
            ,_receipt_doc_id = receipt_couch['_id']
        )
        receipt_master_lst.append(receipt_master)
    Receipt.objects.bulk_create(receipt_master_lst)

    #retrieve ids for create receipt in master
    receipt_master_lst = get_receipt_lst_from_master_based_on_receipt_couch_lst(receipt_couch_lst)

    #return lookup from receipt_couch to receipt_master
    return fomulate_receipt_id_c2mLookup(receipt_couch_lst,receipt_master_lst)


def get_sp_id_c2mLookup(receipt_couch_lst,store_id):
    _1_create_offline_sp = get_create_offline_sp(receipt_couch_lst,True)
    _1_create_offline_dic = create_new_sp(_1_create_offline_sp,store_id)

    _0_create_offline_sp = get_create_offline_sp(receipt_couch_lst,False)
    _0_create_offline_dic = get_sp_lookup(_0_create_offline_sp,store_id)

    _0_create_offline_dic.update(_1_create_offline_dic)
    return _0_create_offline_dic


#------------------------------------------------------------------------------------------


def get_receipt_master_from_lst_based_on_receipt_couch_doc_id(receipt_master_lst,receipt_couch_doc_id):
    result = None
    for receipt_master in receipt_master_lst:
        if receipt_master._receipt_doc_id == receipt_couch_doc_id:
            result = receipt_master
            break

    return result


def fomulate_receipt_id_c2mLookup(receipt_couch_lst,receipt_master_lst):
    """
        when we insert receipt to master, we also insert doc_id of receipt from couch. we use that as a link to from look up from couch to master
    """
    result = {}

    for receipt_couch in receipt_couch_lst:
        receipt_master = get_receipt_master_from_lst_based_on_receipt_couch_doc_id(receipt_master_lst,receipt_couch['_id'])
        result[receipt_couch['_id']] = receipt_master.id

    return result


def get_receipt_lst_from_master_based_on_receipt_couch_lst(receipt_couch_lst):
    receipt_couch_doc_id_lst = [receipt_couch['_id'] for receipt_couch in receipt_couch_lst]
    return Receipt.objects.filter(_receipt_doc_id__in = receipt_couch_doc_id_lst)#refeshing receipt_lst to get the primary key


def create_new_sp(sp_couch_lst,store_id):
    """
        the param list provided is a list of sp that is created offline. 
        create sp for couch and master using sp_inserter. NOTICE that sp is not exist in couch. it is only exist inside couch.receipt_ln which later will be remove.
        return lookup for sp_id between couch and master
    """
    result = {}

    #assert sp_couch_lst have store_product.product_id = None
    for sp_couch in sp_couch_lst:
        if sp_couch['product_id'] != None and len(sp_couch['sku_lst']) != 1:
            raise Exception('Bug')

    #create
    for sp_couch in sp_couch_lst:
        sp_master = new_sp_inserter.exe(
             store_id = store_id
            ,name = sp_couch['name']
            ,price = sp_couch['price']
            ,crv = sp_couch['crv']
            ,is_taxable = sp_couch['is_taxable']
            ,is_sale_report = sp_couch['is_sale_report']
            ,p_type = sp_couch['p_type']
            ,p_tag = sp_couch['p_tag']
            ,sku_str = sp_couch['sku_lst'][0]
            ,cost = sp_couch['cost']
            ,vendor = sp_couch['vendor']
            ,buydown = sp_couch['buydown']
        )
        result[sp_couch['_id']] = sp_master.id

    return result


def get_sp_lookup(sp_couch_lst,store_id):
    """
        the param list provided is a list of sp that is not created offline. 
        simply return look up what is the sp_id from master db based on product_id and store_id
    """
    #assert sp_couch_lst have store_product.product_id = None
    lookup_result = {}

    pid_lst = []
    for sp_couch in sp_couch_lst:
        pid = sp_couch['product_id']
        if not pid in pid_lst:
            pid_lst.append(pid)


    if len(pid_lst) != 0:
        sp_master_lst = Store_product.objects.filter(store_id=store_id,product_id__in=pid_lst)

        #formate lookup
        for sp_couch in sp_couch_lst:
            pid = sp_couch['product_id']
            sp_master = get_sp_master_based_on_pid_from_sp_master_lst(sp_master_lst,pid)
            lookup_result[sp_couch['_id']] = sp_master.id
        
    return lookup_result


def get_sp_master_based_on_pid_from_sp_master_lst(sp_master_lst,pid):
    result = None

    for sp_master in sp_master_lst:
        if sp_master.product.id == pid:
            result = sp_master
            break

    return result



def get_create_offline_sp(receipt_couch_lst,is_create_offline_criteria):
    result = []
    for receipt_couch in receipt_couch_lst:
        for receipt_ln_couch in receipt_couch['ds_lst']:
            
            if receipt_ln_couch['store_product'] == None:
                continue

            is_create_offline = receipt_ln_couch['store_product']['product_id'] == None
            if is_create_offline == is_create_offline_criteria:
                result.append(receipt_ln_couch['store_product']) 

    return result



