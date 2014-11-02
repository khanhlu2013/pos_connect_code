from couchdb import Server,ResourceNotFound
from util import couch_util
from store.models import Store

# def get_store_db(*args, **kwargs):
#     if settings.IS_LOCAL_ENV:
#         name = settings.COUCH_LOCAL_ADMIN_NAME
#         pwrd = settings.COUCH_LOCAL_ADMIN_PWRD
#         url = settings.COUCH_LOCAL_URL
#     else:
#         kwargs_len = len(kwargs)
#         if kwargs_len == 0:
#             raise Exception
#         elif kwargs_len == 1:
#             store = kwargs['store']
#             name = store.couch_admin_name
#             pwrd = store.couch_admin_pwrd
#             url = store.couch_url
#         else:
#             name = kwargs['name']
#             pwrd = kwargs['pwrd']
#             url = kwargs['url']

#     try:
#         url = couch_util.get_couch_access_url(name=name,pwrd=pwrd,url=url)
#         server = Server(url)        
#         store_db_name = couch_util.get_store_db_name(store_id)
#         return server[store_db_name]
#     except ResourceNotFound:
#         return None


def get_store_db(store_id):
    store = Store.objects.get(pk=store_id)

    try:
        url = couch_util.get_couch_access_url(store=store)
        server = Server(url)        
        store_db_name = couch_util.get_store_db_name(store_id)
        return server[store_db_name]
    except ResourceNotFound:
        return None