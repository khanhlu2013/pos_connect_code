from store.couch import store_util
from util.couch import reader_lst_getter,master_account_util,couch_constance
import requests
import json
from util.couch import user_util,couch_util

def _couch_db_insert_user_2_store(store_id):
    admin_name = master_account_util.get_master_user_name()
    reader_name = user_util.get_client_user_name(store_id)
    db_name = store_util.get_store_db_name(store_id)
    secure_url = couch_util.get_url_using_admin_account() + "/" + db_name + '/_security'
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
    url = couch_util.get_url_using_admin_account() + '/_users/' + user_id

    data = {
         "_id": user_id
        ,"name" : username
        ,"type" : "user"
        ,"roles" : []
        ,"password" : password
    }
    headers = {'Content-type': 'application/json'}
    res = requests.put(url, data=json.dumps(data), headers=headers)  