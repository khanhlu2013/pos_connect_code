from couch import couch_util
from util.couch import reader_lst_getter
import requests
import json
from util.couch import user_util
from django.conf import settings

def exe(store_id):
    user_name,user_pwrd = _couch_db_insert_user(store_id)
    _couch_db_insert_user_2_store(store_id,user_name)
    return (user_name,user_pwrd)

def _couch_db_insert_user_2_store(store_id,user_name):
    admin_name = settings.COUCH_MASTER_USER_NAME
    reader_name = user_name
    db_name = couch_util.get_store_db_name(store_id)
    secure_url = couch_util.get_couch_access_url() + "/" + db_name + '/_security'
    data = {
        "admins"    : {"names":[admin_name],"roles":[]},
        "readers"   : {"names":[reader_name],"roles":[]}
    }
    headers = {'Content-type': 'application/json'}
    requests.put(secure_url, data=json.dumps(data), headers=headers)


def _couch_db_insert_user(store_id):
    username = str(store_id)
    password = str(store_id)
    user_id = store_id
    url = couch_util.get_couch_access_url() + '/_users/' + user_id

    data = {
         "_id": user_id
        ,"name" : username
        ,"type" : "user"
        ,"roles" : []
        ,"password" : password
    }
    headers = {'Content-type': 'application/json'}
    res = requests.put(url, data=json.dumps(data), headers=headers)  
    return (username,password)

     