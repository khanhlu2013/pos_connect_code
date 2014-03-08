from util.couch import couch_util
from django.conf import settings
from util.couch import couch_constance
from product.couch import approve_product_db_getter

def exe(product_id):
    db = approve_product_db_getter.exe()
    view_name = couch_util.get_full_view_name(couch_constance.APPROVE_PRODUCT_DB_BY_PRODUCT_ID_VIEW_NAME)
    key = product_id
    view_result = db.view(view_name)[key]
    rows = view_result.rows

    if len(rows) > 1:
        raise MultipleObjectsReturned
    elif len(rows) == 0:
        return None
    else: return rows[0].value  



