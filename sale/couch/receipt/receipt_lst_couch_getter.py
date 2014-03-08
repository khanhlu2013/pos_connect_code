from store.couch import store_util
from util.couch import couch_constance,couch_util

def exe(store_id):
    db = store_util.get_store_db(store_id)
    view_name = couch_util.get_full_view_name(couch_constance.STORE_DB_VIEW_NAME_BY_D_TYPE)
    key = couch_constance.RECEIPT_DOCUMENT_TYPE
    view_result = db.view(view_name)[key]
    rows = view_result.rows

    receipt_lst = []
    for row in rows:
    	cur_receipt = row.value
    	# cur_receipt['id'] = row.id
    	receipt_lst.append(cur_receipt)

    return receipt_lst
