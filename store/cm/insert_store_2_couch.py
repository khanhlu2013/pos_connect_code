from django.conf import settings
from util import couch_util
from store.cm import insert_user_into_old_couch_4_test_purpose
from couchdb import Server
import requests
import json


def exe(store_id,couch_admin_name=None,couch_admin_pwrd=None,couch_url=None):
    """
        intro: by now, a store is already record in master and we have that store_id but we don't have a corresponding information on couch

        STEP1: we need to create a db having a name based on store_id param using admin account to couchdb as mention below:
            . for online, we need to supply this admin user name, password and url to access cloudant specific for this store
            . for offline,we just use the local env for admin name,password and url to couch db

        STEP2: we need to create a user and password that can access this db.
            . for online,  we accomplish this task by using cloudant api key
            . for offline, we accomplish this task by using traditional couchdb api

        STEP3: we insert design documents. This is the same for online and offline        

        STEP4: return user_name,user_pwrd that can access to this couch db
    """
    #STEP1
    couch_access_url = None
    if settings.IS_USE_COUCH_VS_BIG_COUCH:
        couch_access_url = couch_util.get_couch_access_url()
    else:
        couch_access_url = couch_util.get_couch_access_url(name=couch_admin_name,pwrd=couch_admin_pwrd,url=couch_url)
    server = Server(couch_access_url)
    db_name = couch_util.get_store_db_name(store_id)
    couch_db = server.create(db_name) 

    #STEP2
    api_key_name = None
    api_key_pwrd = None
    if settings.IS_USE_COUCH_VS_BIG_COUCH:
        insert_user_into_old_couch_4_test_purpose.exe(store_id)
        api_key_name = str(store_id)
        api_key_pwrd = str(store_id)
    else:
        api_key_name,api_key_pwrd = _get_cloudant_api_key(couch_admin_name,couch_admin_pwrd)
        _grant_cloudant_access_to_api_key(api_key_name,store_id,['_reader',],couch_admin_name,couch_admin_pwrd)

    #STEP3:insert design documents
    _insert_by_pid_view(couch_db)
    _insert_by_sku_view(couch_db)
    _insert_by_d_type_view(couch_db)

    #STEP4:return user_name,user_pwrd 
    return (api_key_name,api_key_pwrd)

def _insert_by_sku_view(couch_db):
    map_func = \
        """function(doc) {
          if(doc.d_type == '%s')
          for(var i=0; i<doc.sku_lst.length;i++){
            emit(doc.sku_lst[i], doc);
          }
        }""" % (settings.STORE_PRODUCT_DOCUMENT_TYPE,)

    view = { \
         settings.STORE_DB_VIEW_NAME_BY_SKU:{"map":map_func}
    }

    doc = {"_id":'_design/' + settings.STORE_DB_VIEW_NAME_BY_SKU,"language":"javascript","views":view}
    couch_db.save(doc) 
    
def _insert_by_pid_view(couch_db):
    map_func = \
        """function(doc) {
          if(doc.d_type.localeCompare('%s')==0){
            emit(doc.product_id, doc);
          }
        }""" % (settings.STORE_PRODUCT_DOCUMENT_TYPE,)

    view = { \
         settings.STORE_DB_VIEW_NAME_BY_PRODUCT_ID:{"map":map_func}
    }

    doc = {"_id":'_design/' + settings.STORE_DB_VIEW_NAME_BY_PRODUCT_ID,"language":"javascript","views":view}
    couch_db.save(doc)  

def _insert_by_d_type_view(couch_db):
    map_func = \
        """function(doc) {
          if(doc.d_type != undefined){
            emit(doc.d_type, doc);
          }
        }"""

    view = { \
         settings.STORE_DB_VIEW_NAME_BY_D_TYPE:{"map":map_func}
    }

    doc = {"_id":'_design/' + settings.STORE_DB_VIEW_NAME_BY_D_TYPE,"language":"javascript","views":view}
    couch_db.save(doc)    

def _get_cloudant_api_key(couch_admin_name,couch_admin_pwrd):
    headers={'referer': 'https://%s.cloudant.com' % (couch_admin_name), 'content-type': 'multipart/form-data'}
    url='https://cloudant.com/api/generate_api_key'
    r = requests.post(url,headers=headers,auth=(couch_admin_name,couch_admin_pwrd))

    if not r.ok:
        raise Exception('error code: ' + str(r.status_code) + ' ,reason: ' + r.reason)
    else:
        dic = json.loads(r._content)
        return (dic['key'],dic['password'])    

def _grant_cloudant_access_to_api_key(api_key_name,store_id,roles,couch_admin_name,couch_admin_pwrd):
    url = 'https://cloudant.com/api/set_permissions'
    prefix = couch_admin_name

    role_str = ""
    for item in roles:
        role_str += ('&roles=' + item)

    db_name = couch_util.get_store_db_name(store_id)
    data_str = 'database=%s/%s&username=%s' % (prefix,db_name,api_key_name)
    data_str += role_str
    headers = {'content-type': 'application/x-www-form-urlencoded'}

    r = requests.post(url,data=data_str,headers=headers,auth=(couch_admin_name,couch_admin_pwrd))            