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

        #TEST CLIENT USER EXIST
        client_user = user_util.get_client_user(store.id)
        self.assertTrue(client_user!=None)

        #TEST SECURITY
        security_info = store_db.get('_security')

        #TEST ADMINS SECURITY INFO
        admins = security_info['admins']['names']
        self.assertEqual(len(admins),1)
        admin = admins[0]
        self.assertEqual(admin,master_account_util.get_master_user_name())

        #TEST READERS SECURITY INFO
        readers = security_info['readers']['names']
        self.assertEqual(len(readers),1)
        reader = readers[0]
        self.assertEqual(reader,user_util.get_client_user_name(store.id))

        #TEST STORE CAN ACCESS APPROVE PRODUCT DB
        db = approve_product_db_getter.exe()
        reader_lst = reader_lst_getter.exe(db)
        client_user_name = user_util.get_client_user_name(store.id)
        self.assertTrue(client_user_name in reader_lst)

        #TEST TAX_RATE
        self.assertEqual(store.tax_rate,tax_rate)
        tax_document = tax_util.get_tax_document(store.id)
        self.assertTrue(tax_document!=None)
        self.assertEqual(tax_document["tax_rate"],str(tax_rate))

