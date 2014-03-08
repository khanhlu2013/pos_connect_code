from django.conf import settings
from couchdb import Server
from util.couch import couch_constance,master_account_util

def get_url_using_admin_account():
    return 'https://' + master_account_util.get_master_user_name() + ':' + master_account_util.get_master_user_password() + '@' + settings.COUCHDB_URL

def get_server(url):
	return Server(url)

def get_server_using_admin_account():
    return get_server(get_url_using_admin_account())

def number_2_str(number):
	if number == None:
		return None
	else:
		return str(number)

def get_full_view_name(view_name):
	return couch_constance.VIEW_DOCUMENT_ID + '/_view/' + view_name





