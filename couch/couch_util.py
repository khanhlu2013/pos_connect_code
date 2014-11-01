from django.conf import settings
from couchdb import Server,ResourceNotFound
from store.models import Store

def get_couch_access_url(*args, **kwargs):
    kwargs_len = len(kwargs)
    if kwargs_len == 0:
        if not settings.IS_LOCAL_ENV:
            raise Exception
            
        name = settings.COUCH_LOCAL_ADMIN_NAME
        pwrd = settings.COUCH_LOCAL_ADMIN_PWRD
        url = settings.COUCH_LOCAL_URL
    elif kwargs_len == 1:
        store = kwargs['store']
        name = store.api_key_name
        pwrd = store.api_key_pwrd
        url = store.couch_url
    else:
        name = kwargs['name']
        pwrd = kwargs['pwrd']
        url = kwargs['url']

    protocol = 'https://' if settings.COUCH_DB_HTTP_S else 'http://'
    return protocol + name + ':' + pwrd + '@' + url

def get_store_db(store_id):
    try:
        store = Store.objects.get(pk=store_id)
        url = couch_util.get_couch_access_url(store=store)
        server = Server(url)        
        store_db_name = get_store_db_name(store_id)
        return server[store_db_name]
    except ResourceNotFound:
        return None

def decimal_2_str(number): 
    """
        django models use Decimal which couch can not handle. we need to convert Decimal to string for couch to handle. 
    """
    if number == None:
        return None
    else:
        return str(number)

def get_store_db_name(store_id):
    return settings.STORE_DB_PREFIX + str(store_id)

#-PRIVATE--------------------------------------------------------------------------------------



def _get_full_view_name(view_name): # 1111 rethink about this
    return settings.VIEW_DOCUMENT_ID + '/_view/' + view_name