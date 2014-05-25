from sale.sale_couch.receipt.document import Receipt_document
from couch import couch_constance
from couch import couch_util
from couchdb import Server
from store.models import Store


def exe(ds_lst,tax_rate,time_stamp,store_id,api_key_name,api_key_pwrd):

    doc = Receipt_document(
         d_type = couch_constance.RECEIPT_DOCUMENT_TYPE
        ,ds_lst = ds_lst
        ,tax_rate = tax_rate
        ,time_stamp = time_stamp
    )

    db = couch_util.get_store_db_use_store_account(store_id,api_key_name,api_key_pwrd)
    doc.store(db)
    return doc
