from store.couch import store_util
from tax.couch import tax_util
from util.couch import couch_util

def exe(store):
    exe_master(store)
    exe_couch(store)

def exe_master(store):
    store.save(by_pass_cm=True)

def exe_couch(store):
    tax_document = tax_util.get_tax_document(store.id)
    db = store_util.get_store_db(store.id)
    tax_document["tax_rate"] = couch_util.number_2_str(store.tax_rate)
    db.update([tax_document,])