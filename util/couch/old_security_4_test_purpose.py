from couch import couch_util
from util.couch import reader_lst_getter
import requests
import json
from util.couch import user_util
from django.conf import settings

def exe(store_id):
    _couch_db_insert_user(store_id)
    _couch_db_insert_user_2_store(store_id)

def _couch_db_insert_user_2_store(store_id):
    admin_name = settings.COUCH_MASTER_USER_NAME
    reader_name = user_util.get_client_user_name(store_id)
    db_name = couch_util._get_store_db_name(store_id)
    secure_url = get_url_using_admin_account() + "/" + db_name + '/_security'
    data = {
        "admins"    : {"names":[admin_name],"roles":[]},
        "readers"   : {"names":[reader_name],"roles":[]}
    }
    headers = {'Content-type': 'application/json'}
    requests.put(secure_url, data=json.dumps(data), headers=headers)


def _couch_db_insert_user(store_id):
    username = user_util.get_client_user_name(store_id)
    password = user_util.get_client_user_password(store_id)
    user_id = user_util.get_client_user_id(store_id)
    url = get_url_using_admin_account() + '/_users/' + user_id

    data = {
         "_id": user_id
        ,"name" : username
        ,"type" : "user"
        ,"roles" : []
        ,"password" : password
    }
    headers = {'Content-type': 'application/json'}
    res = requests.put(url, data=json.dumps(data), headers=headers)  


def get_url_using_admin_account():
    name = settings.COUCH_MASTER_USER_NAME
    pwrd = settings.COUCH_MASTER_USER_PASSWORD
    return couch_util.get_couch_url(name,pwrd)
     