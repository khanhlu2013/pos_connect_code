from django_webtest import WebTest
from django.conf import settings
import requests
from model_mommy import mommy
from util.couch import user_util
from tax.couch import tax_util
from helper import test_helper 
from store.couch import store_util
from couchdb import ResourceNotFound
from util.couch import master_account_util,reader_lst_getter
from product.couch import approve_product_db_getter

class Store_inserter(WebTest):

    def setUp(self):
        test_helper.setup_test_couchdb()

    # def tearDown(self):
    #     test_helper.teardown_test_couchdb()

    def store_inserter_can_insert_store_test(self):
        #foreman start -e .env,test.env test.store.store_inserter_test:Store_inserter.store_inserter_can_insert_store_test        
        #foreman start -e .env,test.env python manage.py test.store.store_inserter_test:Store_inserter.store_inserter_can_insert_store_test
        #foreman run -e .env,test.env coverage run manage.py test.store.store_inserter_test:Store_inserter.store_inserter_can_insert_store_test
        #coverage run manage.py test --settings=settings.test test.store.store_inserter_test:Store_inserter.store_inserter_can_insert_store_test
        
        #SETUP COUCHDB
        test_helper.setup_test_couchdb()

        #CREATE STORE. THIS WILL CREATE PRIVATE USER AND PRIVATE SALE_RECORD DATABASE
        tax_rate = 8.75
        store = mommy.make('store.Store',tax_rate=tax_rate)
        store2 = mommy.make('store.Store',tax_rate=tax_rate)
        
        #-ASSERT
        #.store_[store_id] database is created in couch
        store_db = store_util.get_store_db(store_id = store.id)
        self.assertTrue(store_db!=None)

        #TEST SECURITY
        security_info = store_db.get('_security')
        user_lst = security_info['cloudant']
        self.assertEqual(len(user_lst),2)

        #TEST ADMINS SECURITY INFO
        admin_right_lst = user_lst.pop(master_account_util.get_master_user_name())
        self.assertEqual(len(admin_right_lst),3)
        self.assertTrue(['_admin','_reader','_writer'] in admin_right_lst)

        #TEST USER SECURITY INFO
        user,store_right_lst = user_lst.popitem()
        self.assertTrue(['_reader','_writer'] in store_right_lst)

        #TEST STORE CAN ACCESS APPROVE PRODUCT DB
        ap_db = approve_product_db_getter.exe()
        security_info = ap_db.get('_security')
        user_lst = security_info(['cloudant'])
        self.asertTrue(user in user_lst)
        reader_lst = reader_lst_getter.exe(ap_db)

        #TEST TAX_RATE
        self.assertEqual(store.tax_rate,tax_rate)
        tax_document = tax_util.get_tax_document(store.id)
        self.assertTrue(tax_document!=None)
        self.assertEqual(tax_document["tax_rate"],str(tax_rate))

