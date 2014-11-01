from django.conf import settings
from couch import couch_util
from store.cm import insert_user_into_old_couch_4_test_purpose

def exe(store_id):
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
    couch_url = None
    if settings.IS_LOCAL_ENV:
        couch_url = couch_util.get_couch_access_url()
    else:
        couch_url = xxx
    server = Server(couch_url)
    db_name = couch_util.get_store_db_name(store_id)
    db = server.create(db_name) 

    #STEP2
    user_name = None
    user_pwrd = None
    if settings.IS_LOCAL_ENV:
        user_name,user_pwrd = insert_user_into_old_couch_4_test_purpose
    else:
        xxx = xxx

    #STEP3:insert design documents
    _couch_db_insert_view(db)

    #STEP4:return user_name,user_pwrd 
    return (user_name,user_pwrd)