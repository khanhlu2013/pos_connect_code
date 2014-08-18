from sale.sale_couch.receipt import receipt_lst_couch_getter
from couch import couch_util
from store_product.cm import insert_new

def exe(store_id):
    receipt_couch_lst = receipt_lst_couch_getter.exe(store_id)
    if len(receipt_couch_lst) == 0:
        return;

    new_sp_lst = get_new_sp_lst(receipt_couch_lst)
    couch_sp_id_2_pid_lookup = create_new_sp(new_sp_lst,store_id)
    update_couch_receipt(couch_sp_id_2_pid_lookup,receipt_couch_lst,store_id)
    return len(couch_sp_id_2_pid_lookup)

def update_couch_receipt(couch_sp_id_2_pid_lookup,receipt_couch_lst,store_id):
    receipt_lst_2_update = []

    for receipt in receipt_couch_lst:
        need_to_update_flag = False

        for receipt_ln in receipt['ds_lst']:
            sp = receipt_ln['store_product']
            if(sp != None and sp['product_id'] == None):
                pid = couch_sp_id_2_pid_lookup[sp['_id']]
                if pid == None:
                    raise Exception('Bug')
                sp['product_id'] = pid
                need_to_update_flag = True

        if need_to_update_flag:
            receipt_lst_2_update.append(receipt)

    if len(receipt_lst_2_update) == 0:
        raise Exception('Bug')

    db = couch_util.get_store_db(store_id)
    db.update(receipt_lst_2_update)


def get_new_sp_lst(receipt_couch_lst):
    result = []

    for receipt in receipt_couch_lst:
        for receipt_ln in receipt['ds_lst']:
            cur_sp = receipt_ln['store_product']
            if cur_sp != None and cur_sp['product_id'] == None:
                result.append(cur_sp)

    return result

def create_new_sp(new_sp_lst,store_id):
    """
        the param list provided is a list of sp that is created offline. 
        create sp for couch and master using sp_inserter. NOTICE that sp is not exist in couch. it is only exist inside couch.receipt_ln which later will be remove.
        return lookup for couch_sp_id and pid
    """
    result = {}

    #assert new_sp_lst have store_product.product_id = None
    for sp in new_sp_lst:
        if sp['product_id'] != None and len(sp['sku_lst']) != 1:
            raise Exception('Bug')

    #create
    for sp in new_sp_lst:
        sp_master = insert_new.exe(
             store_id = store_id
            ,name = sp['name']
            ,price = sp['price']
            ,value_customer_price = sp['value_customer_price']
            ,crv = sp['crv']
            ,is_taxable = sp['is_taxable']
            ,is_sale_report = sp['is_sale_report']
            ,p_type = sp['p_type']
            ,p_tag = sp['p_tag']
            ,sku_str = sp['sku_lst'][0]
            ,cost = sp['cost']
            ,vendor = sp['vendor']
            ,buydown = sp['buydown']
        )
        result[sp['_id']] = sp_master.product.id

    return result
