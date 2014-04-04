from couch import couch_util
from django.conf import settings


def get_users_db():
    server = couch_util._get_couch_server()
    return server['_users']
    
#CLIENT USER
def get_client_user_name(store_id):
    return settings.CLIENT_USER_NAME_PREFIX + str(store_id)

def get_client_user_password(store_id):
    return get_client_user_name(store_id)

def get_client_user_id(store_id):
    return settings.USER_ID_PREFIX + get_client_user_name(store_id)

def get_client_user(store_id):
    print('-xxx-')
    db = get_users_db()
    return db.get(id=get_client_user_id(store_id))

def delete_client_user(store_id):
    db = get_users_db()
    user_doc = get_client_user(store_id)
    db.delete(user_doc)


  