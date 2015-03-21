from util import couch_db_util
from django.conf import settings

def get_item(product_id,store_id):
    db = couch_db_util.get_store_db(store_id)
    view_name = couch_db_util.get_full_view_name(settings.STORE_DB_VIEW_NAME_BY_PRODUCT_ID)
    key = int(product_id)
    view_result = db.view(view_name)[key]
    rows = view_result.rows

    if len(rows) > 1:
        raise MultipleObjectsReturned
    elif len(rows) == 0:
        return None
    else: return rows[0].value

def get_lst(pid_lst,store_id):
    db = couch_db_util.get_store_db(store_id)
    view_name = couch_db_util.get_full_view_name(settings.STORE_DB_VIEW_NAME_BY_PRODUCT_ID)
    rows = db.view(view_name,keys=pid_lst,include_docs=True)

    result = [row.doc for row in rows]
    return result