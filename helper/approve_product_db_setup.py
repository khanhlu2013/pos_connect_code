from util.couch import couch_util
from util.couch import couch_constance,master_account_util
from django.conf import settings
from product.couch import approve_product_db_getter
import requests
import json

def exe_delete():
    if approve_product_db_getter.exe() != None:
        _delete_db()

def exe_create():
    #setup approve product db in couch

    exe_delete()
    insert_db()
    insert_security()
    insert_view()
    insert_validation()


def insert_db():
    server = couch_util.get_server_using_admin_account()
    return server.create(couch_constance.APPROVE_PRODUCT_DB_NAME)

def insert_security():
    admin_name = master_account_util.get_master_user_name()
    db_name = couch_constance.APPROVE_PRODUCT_DB_NAME
    secure_url = couch_util.get_url_using_admin_account() + "/" + db_name + '/_security'
    data = {
        "admins"    : {"names":[admin_name],"roles":[]},
        "readers"   : {"names":[],"roles":[]}
    }
    headers = {'Content-type': 'application/json'}
    requests.put(secure_url, data=json.dumps(data), headers=headers)    

def _delete_db():
    server = couch_util.get_server_using_admin_account()
    server.delete(couch_constance.APPROVE_PRODUCT_DB_NAME)    

def insert_view():
    by_product_id_view_map_function = \
    """function(doc) {
      if(doc.d_type.localeCompare('%s')==0){
        emit(doc.product_id, doc);
      }
    }""" % (couch_constance.APPROVE_PRODUCT_DOC_TYPE,)

    by_sku_view_map_function = \
    """function(doc) {
      if(doc.d_type == '%s')
      for(var i=0; i<doc.sku_lst.length;i++){
        emit(doc.sku_lst[i], doc);
      }
    }""" % (couch_constance.APPROVE_PRODUCT_DOC_TYPE,)

    views = { \
         couch_constance.APPROVE_PRODUCT_DB_BY_PRODUCT_ID_VIEW_NAME:{"map":by_product_id_view_map_function}
        ,couch_constance.APPROVE_PRODUCT_DB_BY_SKU_VIEW_NAME:{"map":by_sku_view_map_function}
    }

    view_doc = {"_id":couch_constance.VIEW_DOCUMENT_ID,"language":"javascript","views":views}
    db = approve_product_db_getter.exe()
    db.save(view_doc)   


def insert_validation():
    validation_src = \
    """function(newDoc, oldDoc, userCtx, secObj){
        /*
            Algorithm:  authorization of user's request to couch_server is based on the account user name. If the user
                        is the Client, we can only do insert and read. Only Master can create and update.
        */
        if(userCtx.name.localeCompare('%s') == 0){
            if(newDoc._deleted){
                return;//allow deletion
            }
            else{
                return;//allow admin to do whatever
            }
        }else{
            throw({ unauthorized: 'only admin can crud.' });
        }
    }

    function validate_prod_bus_assoc_crud(){
        //todo
    }""" % (master_account_util.get_master_user_name(),)

    validation_doc  = {"_id":"_design/validation",  "validate_doc_update":validation_src}
    db = approve_product_db_getter.exe()
    db.save(validation_doc)

