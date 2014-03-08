from sale.couch.receipt.document import Receipt_document
from util.couch import couch_constance
from store.couch import store_util

def exe(collected_amount,ds_lst,tax_rate,time_stamp,store_id):

    doc = Receipt_document(
         d_type = couch_constance.RECEIPT_DOCUMENT_TYPE
        ,collected_amount = collected_amount
        ,ds_lst = ds_lst
        ,tax_rate = tax_rate
        ,time_stamp = time_stamp
    )

    db = store_util.get_store_db(store_id,use_store_account=True)
    doc.store(db)
