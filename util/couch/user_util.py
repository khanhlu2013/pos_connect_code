from util.couch import couch_util
from django.conf import settings
import random

def get_users_db():
    server = couch_util.get_server_using_admin_account()
    return server['_users']
    
#CLIENT USER
def get_client_user_name(store_id):
    return settings.CLIENT_USER_NAME_PREFIX + str(store_id)

def get_client_user_password(store_id):
    # random.seed(store_id)
    # ran = random.random()
    # ran *= (10 ** 17)
    # return str(ran)
    return get_client_user_name(store_id)

def get_client_user_id(store_id):
    return settings.USER_ID_PREFIX + get_client_user_name(store_id)

def get_client_user(store_id):
    db = get_users_db()
    return db.get(id=get_client_user_id(store_id))

def delete_client_user(store_id):
    db = get_users_db()
    user_doc = get_client_user(store_id)
    db.delete(user_doc)