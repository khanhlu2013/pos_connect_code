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
from util.couch import couch_acl_validator,reader_lst_updator
import hashlib
import os

def exe(store):
    store_id = exe_master(store)
    exe_couch(store_id,store.tax_rate)


def exe_master(store):
    store.save(by_pass_cm=True)
    store_id = store.id
    return store.id


def exe_couch(store_id,tax_rate):
    _couch_db_insert_user(store_id)
    _couch_db_insert_user_to_approve_db(store_id)
    _couch_db_insert_db(store_id)
    _couch_db_insert_security(store_id)
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


# def _couch_db_insert_user(store_id):
#     username = user_util.get_client_user_name(store_id)
#     password = user_util.get_client_user_password(store_id)
#     user_id = user_util.get_client_user_id(store_id)
#     url = couch_util.get_url_using_admin_account() + '/_users/' + user_id

#     data = {
#          "_id": user_id
#         ,"name" : username
#         ,"type" : "user"
#         ,"roles" : []
#         ,"password" : password
#     }
#     headers = {'Content-type': 'application/json'}
#     res = requests.put(url, data=json.dumps(data), headers=headers)

def _couch_db_insert_user(store_id):
    username = user_util.get_client_user_name(store_id)
    password = user_util.get_client_user_password(store_id)
    user_id = user_util.get_client_user_id(store_id)
    url = couch_util.get_url_using_admin_account() + '/_users/' + user_id

    h=hashlib.sha1()
    salt = os.urandom(16).encode('hex')
    h.update(password)
    h.update(salt)

    data = {
         "_id": user_id
        ,"name" : username
        ,"type" : "user"
        ,"roles" : []
        ,"password_sha" : h.digest()
        ,"salt" : salt
    }
    headers = {'Content-type': 'application/json'}
    res = requests.put(url, data=json.dumps(data), headers=headers)


def _couch_db_insert_db(store_id):
    #CREATE LIQUOR DATABASE
    server = couch_util.get_server_using_admin_account()
    db_name = store_util.get_store_db_name(store_id)
    return server.create(db_name)

def _couch_db_insert_user_to_approve_db(store_id):
    reader_lst_updator.exe(store_id)

def _couch_db_insert_security(store_id):
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






