from couch import couch_util
from couchdb import Server

def get_users_db():
    url = couch_util.get_couch_access_url()
    server = Server(url)
    return server['_users']

def get_client_user(store_id):
    db = get_users_db()
    return db.get(id=store_id)

def delete_client_user(store_id):
    db = get_users_db()
    user_doc = get_client_user(store_id)
    db.delete(user_doc)


  