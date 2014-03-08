from django.conf import settings
from util.couch import couch_util,user_util

def get_store_db_name(store_id):
    return settings.STORE_DB_PREFIX + str(store_id)

def get_url_using_store_account(store_id):
    return 

def get_store_db(store_id,use_store_account = False):
    try:
        server = None
        if use_store_account == False:
            server = couch_util.get_server_using_admin_account()
        else:
            url = 'http://' + user_util.get_client_user_name(store_id) + ':' + user_util.get_client_user_password(store_id) + '@' + settings.COUCHDB_URL
            server = couch_util.get_server(url)
        return server[get_store_db_name(store_id)]
    except:
        return None

def delete_store_db(store_id):
    server = couch_util.get_server_using_admin_account()
    server.delete(get_store_db_name(store_id))