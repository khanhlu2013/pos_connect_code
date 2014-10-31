from django.conf import settings
from couchdb import Server
from django.conf import settings

def get_url(name,password):
    protocol = 'https://' if settings.COUCH_DB_HTTP_S else 'http://'
    return protocol + name + ':' + password + '@' + settings.COUCHDB_URL
    
def get_url_using_admin_account():
    return get_url(settings.COUCH_MASTER_USER_NAME,settings.COUCH_MASTER_USER_PASSWORD)

def get_server(url):
    return Server(url)

def get_server_using_admin_account():
    return get_server(get_url_using_admin_account())









