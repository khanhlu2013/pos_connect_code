from couch import couch_util
from couchdb import Server

def get_client_user_id(store_id):
    return 'org.couchdb.user:' + str(store_id)

def delete_client_user(store_id):
    url = couch_util.get_couch_access_url()
    server = Server(url)
    db = server['_users']
    user_id = get_client_user_id(store_id)
    user_doc = db.get(id=user_id)
    db.delete(user_doc)



