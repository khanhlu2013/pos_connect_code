from django_webtest import WebTest
from helper import test_helper
from couch import couch_util
from couchdb.http import Unauthorized
from store_product.sp_couch import store_product_couch_getter
from store_product.cm import insert_new

class Test(WebTest):
    
    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def can_stop_reg_user_to_insert_document(self):
        #foreman  run -e .env_protractor,test.env python manage.py test test.couch.validate_doc_update_test:Test.can_stop_reg_user_to_insert_document
        user,store = test_helper.create_user_then_store()

        db = couch_util.get_store_db_use_store_account(store.id,store.api_key_name,store.api_key_pwrd)
        try:
            a_none_type_doc = {'a':'a'}
            db.save(a_none_type_doc)
        except Unauthorized,err:
            error_type,error_message = err.message
            self.assertEqual(error_type,'unauthorized')
            self.assertEqual(error_message,'regular user is not allow any update operationx')


    def can_stop_reg_user_to_delete_document(self):
        #foreman  run -e .env_protractor,test.env python manage.py test test.couch.validate_doc_update_test:Test.can_stop_reg_user_to_delete_document
        user,store = test_helper.create_user_then_store()

        #.insert new store_product_x
        store_product_x = insert_new.exe(
             store_id = store.id            
            ,name = 'product name'
            ,price = 0.1
            ,value_customer_price = None
            ,crv = 0.2
            ,is_taxable = True
            ,is_sale_report = True
            ,p_type = None
            ,p_tag = None
            ,sku_str = '111'
            ,cost = None
            ,vendor = None
            ,buydown = None
            ,offline_doc_id = None
        )

        sp_couch = store_product_couch_getter.exe(store_product_x.product.id,store_product_x.store.id)
        sp_couch['_deleted'] = True

        db = couch_util.get_store_db_use_store_account(store.id,store.api_key_name,store.api_key_pwrd)
        try:
            db.save(sp_couch)
        except Unauthorized,err:
            error_type,error_message = err.message
            self.assertEqual(error_type,'unauthorized')
            self.assertEqual(error_message,'regular user is not allow any update operation')


    def can_stop_reg_user_to_update_document(self):
        #foreman  run -e .env_protractor,test.env python manage.py test test.couch.validate_doc_update_test:Test.can_stop_reg_user_to_update_document
        user,store = test_helper.create_user_then_store()

        #.insert new store_product_x
        store_product_x = insert_new.exe(
             store_id = store.id            
            ,name = 'product name'
            ,price = 0.1
            ,value_customer_price = None
            ,crv = 0.2
            ,is_taxable = True
            ,is_sale_report = True
            ,p_type = None
            ,p_tag = None
            ,sku_str = '111'
            ,cost = None
            ,vendor = None
            ,buydown = None
            ,offline_doc_id = None
        )

        sp_couch = store_product_couch_getter.exe(store_product_x.product.id,store_product_x.store.id)
        sp_couch['name'] = 'new product name'

        db = couch_util.get_store_db_use_store_account(store.id,store.api_key_name,store.api_key_pwrd)
        try:
            db.save(sp_couch)
        except Unauthorized,err:
            error_type,error_message = err.message
            self.assertEqual(error_type,'unauthorized')
            self.assertEqual(error_message,'regular user is not allow any update operation')
