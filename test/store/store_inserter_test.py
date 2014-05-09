from django_webtest import WebTest
from django.conf import settings
import requests
from model_mommy import mommy
from util.couch import user_util
from helper import test_helper 
from couch import couch_util
from couchdb import ResourceNotFound
from util.couch import master_account_util,reader_lst_getter

# class test(WebTest):

#     def setUp(self):
#         test_helper.setup_test_couchdb()

#     def tearDown(self):
#         test_helper.teardown_test_couchdb()

#     def test(self):

#         # foreman  run -e .env,test.env python manage.py test                          test.store.store_inserter_test:test.test
#         # coverage run                         manage.py test --settings=settings.test test.store.store_inserter_test:test.test
        
#         #SETUP COUCHDB
#         test_helper.setup_test_couchdb()

#         #CREATE STORE. THIS WILL CREATE PRIVATE USER AND PRIVATE SALE_RECORD DATABASE
#         tax_rate = 8.75
#         store = mommy.make('store.Store',tax_rate=tax_rate)
#         store2 = mommy.make('store.Store',tax_rate=tax_rate)
        
#         #-ASSERT
#         #.store_[store_id] database is created in couch
#         store_db = couch_util.get_store_db(store_id = store.id)
#         self.assertTrue(store_db!=None)

#         # #TEST  xxx we will need to uncomment these when we can install bigcouch in this development machine. 
#         # security_info = store_db.get('_security')
#         # self.assertEqual(len(security_info),1)
#         # user_lst = security_info['cloudant']
#         # self.assertEqual(len(user_lst),2)

#         # #TEST ADMINS SECURITY INFO
#         # admin_right_lst = user_lst.pop(master_account_util.get_master_user_name()) #we are getting admin user(there are 2 users in _security: admin and api_key.) 
#         # self.assertEqual(len(admin_right_lst),3)
#         # self.assertTrue(['_admin','_reader','_writer'] in admin_right_lst)

#         # #TEST USER SECURITY INFO
#         # user,store_right_lst = user_lst.popitem()
#         # self.assertTrue(['_reader','_writer'] in store_right_lst)




