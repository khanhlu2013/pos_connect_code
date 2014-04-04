from django.conf import settings
from couchdb import Server
from util.couch import master_account_util

def get_url(name,password):
    protocol = 'https://' if settings.COUCH_DB_HTTP_S else 'http://'
    return protocol + name + ':' + password + '@' + settings.COUCHDB_URL
    
def get_url_using_admin_account():
    return get_url(master_account_util.get_master_user_name(),master_account_util.get_master_user_password())

def get_server(url):
    return Server(url)

def get_server_using_admin_account():
    return get_server(get_url_using_admin_account())









