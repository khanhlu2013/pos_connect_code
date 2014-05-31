from helper import password_helper
from product.models import Product
import store.models
import json
import requests
from util.couch import master_account_util,user_util
from couch import couch_util,couch_constance
from sale.sale_couch.receipt import receipt_document_validator
from util.couch import couch_acl_validator,old_security_4_test_purpose
import hashlib
import os
from couch import couch_util

def exe(store):
    store_id,api_key_name = exe_master(store)
    exe_couch(store_id,store.tax_rate,api_key_name)


def exe_master(store):
    if _is_local_env():
        store.api_key_name,store.api_key_pwrd = (1,1)        
    else:
        store.api_key_name,store.api_key_pwrd = get_cloudant_api_key()
    store.save(by_pass_cm=True)

    #overwrite key_name and password under local env
    if _is_local_env():
        store_db_name = couch_util._get_store_db_name(store.id)
        store.api_key_name,store.api_key_pwrd = store_db_name,store_db_name
        store.save(by_pass_cm=True)

    return store.id,store.api_key_name


def exe_couch(store_id,tax_rate,api_key_name):
    _couch_db_insert_db(store_id)
    _couch_db_insert_view(store_id)
    _couch_db_insert_validation(store_id)
    if _is_local_env():
        old_security_4_test_purpose.exe(store_id)
    else:
        _couch_db_grant_cloudant_access_to_api_key(api_key_name,store_id,['_reader','_writer'])


def get_cloudant_api_key():
    headers={'referer': 'https://%s.cloudant.com' % (master_account_util.get_master_user_name()), 'content-type': 'multipart/form-data'}
    url='https://cloudant.com/api/generate_api_key'
    r = requests.post(url,headers=headers,auth=(master_account_util.get_master_user_name(),master_account_util.get_master_user_password()))

    if not r.ok:
        raise Exception('error code: ' + str(r.status_code) + ' ,reason: ' + r.reason)
    else:
        dic = json.loads(r._content)
        return (dic['key'],dic['password'])



def _couch_db_grant_cloudant_access_to_api_key(api_key_name,store_id,roles):
    url = 'https://cloudant.com/api/set_permissions'
    prefix = master_account_util.get_master_user_name()

    role_str = ""
    for item in roles:
        role_str += ('&roles=' + item)

    db_name = couch_util._get_store_db_name(store_id)
    data_str = 'database=%s/%s&username=%s' % (prefix,db_name,api_key_name)
    data_str += role_str
    headers = {'content-type': 'application/x-www-form-urlencoded'}

    r = requests.post(url,data=data_str,headers=headers,auth=(master_account_util.get_master_user_name(),master_account_util.get_master_user_password()))    

def _couch_db_insert_db(store_id):
    #CREATE LIQUOR DATABASE
    server = couch_util._get_couch_server()
    db_name = couch_util._get_store_db_name(store_id)
    return server.create(db_name)


def _couch_db_insert_view(store_id):
    d_type_view_map_function = \
        """function(doc) {
          if(doc.d_type != undefined){
            emit(doc.d_type, doc);
          }
        }"""

    product_id_view_map_function = \
    """function(doc) {
      if(doc.d_type.localeCompare('%s')==0){
        emit(doc.product_id, doc);
      }
    }""" % (couch_constance.STORE_PRODUCT_DOCUMENT_TYPE,)

    sku_view_map_function = \
    """function(doc) {
      if(doc.d_type == '%s')
      for(var i=0; i<doc.sku_lst.length;i++){
        emit(doc.sku_lst[i], doc);
      }
    }""" % (couch_constance.STORE_PRODUCT_DOCUMENT_TYPE,)

    views = { \
         couch_constance.STORE_DB_VIEW_NAME_BY_PRODUCT_ID:{"map":product_id_view_map_function}
        ,couch_constance.STORE_DB_VIEW_NAME_BY_SKU:{"map":sku_view_map_function}
        ,couch_constance.STORE_DB_VIEW_NAME_BY_D_TYPE:{"map":d_type_view_map_function}
        
    }

    view_doc = {"_id":couch_constance.VIEW_DOCUMENT_ID,"language":"javascript","views":views}
    db = couch_util.get_store_db(store_id)
    db.save(view_doc)


def _couch_db_insert_validation(business_id):

    db = couch_util.get_store_db(business_id)
    
    #ACL - VALIDATION
    acl_validator_doc  = {"_id":"_design/validation",  "validate_doc_update":couch_acl_validator.src}
    db.save(acl_validator_doc)

    #RECEIPT DOCUMENT VALIDATOR
    receipt_validator = {"_id":"_design/receipt_validator",  "validate_doc_update":receipt_document_validator.src}
    db.save(receipt_validator)



def _is_local_env():
    return 'LOCAL_ENVIRONMENT' in os.environ.keys()


