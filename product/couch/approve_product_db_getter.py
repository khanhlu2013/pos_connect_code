from util.couch import couch_constance,couch_util

def exe():
	try:
		server = couch_util.get_server_using_admin_account()
		return server[couch_constance.APPROVE_PRODUCT_DB_NAME]
	except:
		return None