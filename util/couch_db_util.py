from couchdb import Server,ResourceNotFound
from util import couch_util
from store.models import Store


def get_store_db(store_id):
    store = Store.objects.get(pk=store_id)

    try:
        url = couch_util.get_couch_access_url(store=store)
        server = Server(url)        
        store_db_name = couch_util.get_store_db_name(store_id)
        return server[store_db_name]
    except ResourceNotFound:
        return None