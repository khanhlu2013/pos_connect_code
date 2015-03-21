from couchdb import Server,ResourceNotFound
from django.conf import settings

def get_store_db(store_id):
    from store.models import Store
    store = Store.objects.get(pk=store_id)

    try:
        url = get_couch_access_url(store=store)
        server = Server(url)        
        store_db_name = get_store_db_name(store_id)
        return server[store_db_name]
    except ResourceNotFound:
        return None

def get_full_view_name(view_name): 
    """
        since couch build all views that are group into one doc (when any of them is query), i 
        want to have each view reside in a separate doc so that i can fully LAZY building the view 
        to spread out the work load for smoother user experience. 

        Now, we have multiple doc that each have a separate id and each contain 1 view. Thus, I came up with 
        a convention to name the doc_id as _design/view_name so that the doc id can be calculated
        from the view name. This helper function construct the view name that understood by couchdb
    """
    return '_design/' + view_name + '/_view/' + view_name        

def get_couch_access_url(*args, **kwargs):
    """
        if kwargs_len is:
            0 ->    this must be the case of local development where we use COUCH (not big_couch)
                      when we use couch locally there is only ONE couch server (big_couch have n server for n store)
                      and we will use admin name to form the url because there is no need to concern about security 
                      in development mode

            1|2 ->  if this is production mode using big-couch, the arg will contain the store object. Notice in big-couch 
                      there each store is hosting in each separate server. We will default using admin for cloudant account
                      to form the url because we mostly form url to be comsumed by the server code which is located in the 
                      server and not causing security issue. however, there is one case we are forming url to pass down to 
                      the client to access big-couch and the second-arg : 'is_use_api_key' can specify this

            3 ->    this is the case where we want to switch host for big-couch we need to specify the username,pwrd,and new host
                      to form the url
    """
    if settings.IS_USE_COUCH_VS_BIG_COUCH:
        name = settings.COUCH_LOCAL_ADMIN_NAME
        pwrd = settings.COUCH_LOCAL_ADMIN_PWRD
        url = settings.COUCH_LOCAL_URL
    else:
        kwargs_len = len(kwargs)
        if kwargs_len == 0:
            raise Exception
        elif kwargs_len == 1:
            store = kwargs['store']
            name = store.couch_admin_name
            pwrd = store.couch_admin_pwrd
            url = store.couch_url
        elif kwargs_len == 2 and kwargs['is_use_api_key'] == True:
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