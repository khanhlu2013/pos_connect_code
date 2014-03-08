from store.couch import store_util
from django.conf import settings

def get_tax_document(store_id):
    db = store_util.get_store_db(store_id)
    return db.get(id=get_tax_document_id())

def get_tax_document_id():
    return settings.TAX_DOCUMENT_ID