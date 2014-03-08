from store.couch import store_util
from util.couch import couch_util,couch_constance

def exe(product_id,business_id):
	"""
	    RETURN
	        . a document inside couchdb with product_id and business_id
	"""
	db = store_util.get_store_db(business_id)
	view_name = couch_util.get_full_view_name(couch_constance.STORE_DB_VIEW_NAME_BY_PRODUCT_ID)
	key = product_id
	view_result = db.view(view_name)[key]
	rows = view_result.rows

	print(len(rows))
	if len(rows) > 1:
	    raise MultipleObjectsReturned
	elif len(rows) == 0:
	    return None
	else: return rows[0].value