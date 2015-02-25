from django.conf import settings

def get_couch_access_url(*args, **kwargs):
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

def _get_full_view_name(view_name): 
    """
        since couch build all views that are group into one doc (when any of them is query), i 
        want to have each view resign in separate doc so that i can fully LAZY building the view 
        to spread out the work load for smoother user experience. 

        Now, we have multiple doc that each have a separate id and contain 1 view. I also have 
        a convention to name the doc_id as _design/view_name so that the doc id can be calculated
        from the view name. This helper function construct the view name that understood by couchdb
    """
    return '_design/' + view_name + '/_view/' + view_name