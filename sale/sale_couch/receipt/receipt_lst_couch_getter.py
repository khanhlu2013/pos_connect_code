from couch import couch_util
from django.conf import settings

def exe(store_id):
    db = couch_util.get_store_db(store_id)

    view_name = couch_util._get_full_view_name(settings.STORE_DB_VIEW_NAME_BY_D_TYPE)
    key = settings.RECEIPT_DOCUMENT_TYPE
    view_result = db.view(view_name)[key]
    rows = view_result.rows

    receipt_lst = []
    for row in rows:
        cur_receipt = row.value
        receipt_lst.append(cur_receipt)

    return receipt_lst
