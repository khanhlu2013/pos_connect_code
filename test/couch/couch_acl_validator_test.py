from django_webtest import WebTest
from model_mommy import mommy
from helper import test_helper
from store.couch import store_util
from util.couch import couch_constance
from couchdb.http import Unauthorized
from sale.couch.receipt import receipt_inserter_for_test_purpose,receipt_ln_creator_for_test_purpose,receipt_document_validator,receipt_lst_couch_getter
from store_product import insert_new_store_product_cm
from store_product.couch import store_product_couch_getter
from util.couch import couch_acl_validator


class Test(WebTest):
    
    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def can_allow_reg_user_to_insert_receipt_document(self):
        # xxx reimplement test
        #foreman  run -e .env,test.env python manage.py test test.couch.couch_acl_validator_test:Test.can_allow_reg_user_to_insert_receipt_document
        user,store = test_helper.create_user_then_store()

        #.insert new store_product_x
        store_product_x = insert_new_store_product_cm.exe(
             name = 'product name'
            ,price = 0.1
            ,crv = 0.2
            ,isTaxable = True
            ,isTaxReport = True
            ,isSaleReport = True
            ,business_id = store.id
            ,sku_str = '111')


        #.ln: exist store_product_x
        #.ln_sp
        ln_1_sp = store_product_couch_getter.exe(store_product_x.product.id,store_product_x.business.id)
        #.ln
        ln_1_qty = 1
        ln_1_price = 1.1
        ln_1_discount = 1.2
        ln_1_non_product_name = None
        ln_1 = receipt_ln_creator_for_test_purpose.exe(ln_1_qty,ln_1_price,ln_1_discount,ln_1_sp,ln_1_non_product_name)


        #RECEIPT
        collected_amount = 100
        tax_rate = 9.75
        time_stamp = 1
        ds_lst = [ln_1]
        receipt_inserter_for_test_purpose.exe(collected_amount,ds_lst,tax_rate,time_stamp,store.id)


        #ASSERT INSERTION
        receipt_lst = receipt_lst_couch_getter.exe(store.id)
        self.assertEqual(len(receipt_lst),1)


    def can_stop_reg_user_to_insert_none_receipt_document(self):
        # xxx reimplement test
        #foreman  run -e .env,test.env python manage.py test test.couch.couch_acl_validator_test:Test.can_stop_reg_user_to_insert_none_receipt_document
        user,store = test_helper.create_user_then_store()

        db = store_util.get_store_db(store.id,use_store_account=True)
        try:
            a_none_type_doc = {'a':'a'}
            db.save(a_none_type_doc)
        except Unauthorized,err:
            error_type,error_message = err.message
            self.assertEqual(error_type,'unauthorized')
            self.assertEqual(error_message,couch_acl_validator.REGULAR_USER_PERFORM_INSERT_DOCUMENT_OTHER_THAN_RECEIPT_IS_NOT_ALLOW)

        try:
            type_doc = {'d_type':'x_type'}
            db.save(a_none_type_doc)
        except Unauthorized,err:
            error_type,error_message = err.message
            self.assertEqual(error_type,'unauthorized')
            self.assertEqual(error_message,couch_acl_validator.REGULAR_USER_PERFORM_INSERT_DOCUMENT_OTHER_THAN_RECEIPT_IS_NOT_ALLOW)


    def can_stop_reg_user_to_delete_document(self):
        # xxx reimplement test
        #foreman  run -e .env,test.env python manage.py test test.couch.couch_acl_validator_test:Test.can_stop_reg_user_to_delete_document
        user,store = test_helper.create_user_then_store()

        #.insert new store_product_x
        store_product_x = insert_new_store_product_cm.exe(
             name = 'product name'
            ,price = 0.1
            ,crv = 0.2
            ,isTaxable = True
            ,isTaxReport = True
            ,isSaleReport = True
            ,business_id = store.id
            ,sku_str = '111')


        #.ln: exist store_product_x
        #.ln_sp
        ln_1_sp = store_product_couch_getter.exe(store_product_x.product.id,store_product_x.business.id)
        #.ln
        ln_1_qty = 1
        ln_1_price = 1.1
        ln_1_discount = 1.2
        ln_1_non_product_name = None
        ln_1 = receipt_ln_creator_for_test_purpose.exe(ln_1_qty,ln_1_price,ln_1_discount,ln_1_sp,ln_1_non_product_name)


        #RECEIPT
        collected_amount = 100
        tax_rate = 9.75
        time_stamp = 1
        ds_lst = [ln_1]
        receipt_inserter_for_test_purpose.exe(collected_amount,ds_lst,tax_rate,time_stamp,store.id)


        #ASSERT INSERTION
        receipt_lst = receipt_lst_couch_getter.exe(store.id)
        self.assertEqual(len(receipt_lst),1)


        #ASSERT CAN NOT DELETE
        receipt = receipt_lst[0]
        receipt['_deleted'] = True

        db = store_util.get_store_db(store.id,use_store_account=True)
        try:
            db.save(receipt)
        except Unauthorized,err:
            error_type,error_message = err.message
            self.assertEqual(error_type,'unauthorized')
            self.assertEqual(error_message,couch_acl_validator.REGULAR_USER_PERFORM_DELETE_IS_NOT_ALLOW)


    def can_stop_reg_user_to_update_document(self):
        # xxx reimplement test
        #foreman  run -e .env,test.env python manage.py test test.couch.couch_acl_validator_test:Test.can_stop_reg_user_to_update_document
        user,store = test_helper.create_user_then_store()

        #.insert new store_product_x
        store_product_x = insert_new_store_product_cm.exe(
             name = 'product name'
            ,price = 0.1
            ,crv = 0.2
            ,isTaxable = True
            ,isTaxReport = True
            ,isSaleReport = True
            ,business_id = store.id
            ,sku_str = '111')


        #.ln: exist store_product_x
        #.ln_sp
        ln_1_sp = store_product_couch_getter.exe(store_product_x.product.id,store_product_x.business.id)
        #.ln
        ln_1_qty = 1
        ln_1_price = 1.1
        ln_1_discount = 1.2
        ln_1_non_product_name = None
        ln_1 = receipt_ln_creator_for_test_purpose.exe(ln_1_qty,ln_1_price,ln_1_discount,ln_1_sp,ln_1_non_product_name)


        #RECEIPT
        collected_amount = 100
        tax_rate = 9.75
        time_stamp = 1
        ds_lst = [ln_1]
        receipt_inserter_for_test_purpose.exe(collected_amount,ds_lst,tax_rate,time_stamp,store.id)


        #ASSERT INSERTION
        receipt_lst = receipt_lst_couch_getter.exe(store.id)
        self.assertEqual(len(receipt_lst),1)


        #ASSERT CAN NOT UPDATE
        receipt = receipt_lst[0]
        receipt['collected_amount'] = 200

        db = store_util.get_store_db(store.id,use_store_account=True)
        try:
            db.save(receipt)
        except Unauthorized,err:
            error_type,error_message = err.message
            self.assertEqual(error_type,'unauthorized')
            self.assertEqual(error_message,couch_acl_validator.REGULAR_USER_PERFORM_UPDATE_IS_NOT_ALLOW)
