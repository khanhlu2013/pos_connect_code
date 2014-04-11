from django.conf import settings
from couchdb import Server,ResourceNotFound
from couch import couch_constance

def get_couch_url(name,pwrd):
    protocol = 'https://' if settings.COUCH_DB_HTTP_S else 'http://'
    return protocol + name + ':' + pwrd + '@' + settings.COUCHDB_URL  

def get_store_db(store_id):
    try:
        server = _get_couch_server()
        store_db_name = _get_store_db_name(store_id)
        return server[store_db_name]
    except ResourceNotFound:
        return None

def get_store_db_use_store_account(store_id):
    store = Store.objects.get(pk=store_id)
    name = store.api_key_name
    pwrd = store.api_key_pwrd
    couch_url = get_couch_url(name,pwrd)
    server = Server(couch_url)      
    store_db_name = _get_store_db_name(store_id)
    return server[store_db_name]

def delete_store_db(store_id):
    server = _get_couch_server()
    store_db_name = _get_store_db_name(store_id)
    server.delete(store_db_name)

def decimal_2_str(number): 
    """
        django models use Decimal which couch can not handle. we need to convert Decimal to string for couch to handle. 
    """
    if number == None:
        return None
    else:
        return str(number)


#-PRIVATE--------------------------------------------------------------------------------------

def _get_couch_server():
    name = settings.COUCH_MASTER_USER_NAME
    pwrd = settings.COUCH_MASTER_USER_PASSWORD
    couch_url = get_couch_url(name,pwrd)
    return Server(couch_url)    

def _get_store_db_name(store_id):
    return settings.STORE_DB_PREFIX + str(store_id)

def _get_full_view_name(view_name): # 1111 rethink about this
    return couch_constance.VIEW_DOCUMENT_ID + '/_view/' + view_name