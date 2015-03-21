from util import couch_db_util
from util.couch import reader_lst_getter
import requests
import json
from util.couch import user_util
from django.conf import settings

def exe(store_id):
    _create_user(store_id)
    _insert_user_to_store(store_id)

def _insert_user_to_store(store_id):
    admin_name = settings.COUCH_LOCAL_ADMIN_NAME
    reader_name = str(store_id)
    db_name = couch_db_util.get_store_db_name(store_id)
    secure_url = couch_db_util.get_couch_access_url() + "/" + db_name + '/_security'
    data = {
        "admins"    : {"names":[admin_name],"roles":[]},
        "readers"   : {"names":[reader_name],"roles":[]}
    }
    headers = {'Content-type': 'application/json'}
    requests.put(secure_url, data=json.dumps(data), headers=headers)


def _create_user(store_id):
    username = str(store_id)
    password = str(store_id)
    user_id = user_util.get_client_user_id(store_id)
    url = couch_db_util.get_couch_access_url() + '/_users/' + user_id

    data = {
         "_id": user_id
        ,"name" : username
        ,"type" : "user"
        ,"roles" : []
        ,"password" : password
    }
    res = requests.put(url, data=json.dumps(data), headers={'Content-type': 'application/json'})  
    return (username,password)

     