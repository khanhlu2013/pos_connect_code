from util.couch import couch_util,reader_lst_getter,user_util,couch_constance,master_account_util
import requests
import json
from product.couch import approve_product_db_getter

def exe(store_id):
    db = approve_product_db_getter.exe()
    reader_lst = reader_lst_getter.exe(db)
    client_user_name = user_util.get_client_user_name(store_id)
    if client_user_name not in reader_lst:
        reader_lst.append(client_user_name)
        admin_name = master_account_util.get_master_user_name()
        secure_url = couch_util.get_url_using_admin_account() + "/" + couch_constance.APPROVE_PRODUCT_DB_NAME + '/_security'
        data = {
            "admins"    : {"names":[admin_name],"roles":[]},
            "readers"   : {"names":reader_lst,"roles":[]}
        }
        headers = {'Content-type': 'application/json'}
        r = requests.put(secure_url, data=json.dumps(data), headers=headers)
