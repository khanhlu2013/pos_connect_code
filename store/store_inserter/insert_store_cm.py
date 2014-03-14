from helper import password_helper
from product.models import Product
import store.models
import json
import requests
from tax.couch import tax_util
from tax.couch.models import Tax_document
from util.couch import master_account_util,user_util,couch_util,couch_constance
from store.couch import store_util
from sale.couch.receipt import receipt_document_validator
from util.couch import couch_acl_validator
import hashlib
import os

def exe(store):
    store_id,api_key_name = exe_master(store)
    exe_couch(store_id,store.tax_rate,api_key_name)

def get_api_key():
    d = {database:db_name,username:api_key_name,roles:roles}
    headers = {'content-type': 'application/json'}
    url = 'POST https://cloudant.com/api/generate_api_key'
    r = requests.post(url,data=None,headers=headers)    
    if not r.ok:
        raise Exception('error code: ' + r.error + ' ,reason: ' + reason)
    else:
        print('name: ' + r.key)
        print('pwrd: ' + r.password)
        
        return (r.key,r.password)

def exe_master(store):
    store.api_key_name,store.api_key_pwrd = get_api_key()
    store.save(by_pass_cm=True)
    store_id = store.id
    return store.id


def _couch_db_grant_access_to_db(api_key_name,db_name,roles):
    d = {database:db_name,username:api_key_name,roles:roles}
    headers = {'content-type': 'application/json'}
    url = 'https://cloudant.com/api/set_permissions'
    r = requests.post(url,data=json.dumps(d),headers=headers)


def exe_couch(store_id,tax_rate,api_key_name):
    _couch_db_grant_access_to_db(api_key_name,APPROVE_PRODUCT_DB_NAME,['read'])
    _couch_db_insert_db(store_id)
    _couch_db_grant_access_to_db(api_key_name,store_util.get_store_db_name(store_id),['read','write'])
    _couch_db_insert_view(store_id)
    _couch_db_insert_validation(store_id)
    _couch_db_insert_tax_rate(store_id,tax_rate)


def _couch_db_insert_tax_rate(store_id,tax_rate):
    db = store_util.get_store_db(store_id)
    tax_document = Tax_document(
         id = tax_util.get_tax_document_id()
        ,business_id = store_id
        ,tax_rate  = tax_rate
    )
    db.update([tax_document,])


def _couch_db_insert_db(store_id):
    #CREATE LIQUOR DATABASE
    server = couch_util.get_server_using_admin_account()
    db_name = store_util.get_store_db_name(store_id)
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
    db = store_util.get_store_db(store_id)
    db.save(view_doc)


def _couch_db_insert_validation(business_id):

    db = store_util.get_store_db(business_id)
    
    #ACL - VALIDATION
    acl_validator_doc  = {"_id":"_design/validation",  "validate_doc_update":couch_acl_validator.src}
    db.save(acl_validator_doc)

    #RECEIPT DOCUMENT VALIDATOR
    receipt_validator = {"_id":"_design/receipt_validator",  "validate_doc_update":receipt_document_validator.src}
    db.save(receipt_validator)






