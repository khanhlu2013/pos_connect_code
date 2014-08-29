from django_webtest import WebTest
from model_mommy import mommy
from helper import test_helper
from couch import couch_util
from couchdb.http import Unauthorized
from sale.sale_couch.receipt import receipt_inserter_for_test_purpose,receipt_ln_constructor_for_test_purpose,receipt_document_validator,receipt_lst_couch_getter
from store_product.cm import insert_new
from store_product.sp_couch import store_product_couch_getter
from util.couch import couch_acl_validator


# class Test(WebTest):
    
#     def setUp(self):
#         test_helper.setup_test_couchdb()

#     def tearDown(self):
#         test_helper.teardown_test_couchdb()

#     def can_allow_reg_user_to_insert_receipt_document(self):
#         # xxx reimplement test
#         #foreman  run -e .env,test.env python manage.py test test.couch.couch_acl_validator_test:Test.can_allow_reg_user_to_insert_receipt_document
#         user,store = test_helper.create_user_then_store()

#         #.insert new store_product_x
#         store_product_x = insert_new.exe(
#              store_id = store.id            
#             ,name = 'product name'
#             ,price = 0.1
#             ,crv = 0.2
#             ,is_taxable = True
#             ,is_sale_report = True
#             ,p_type = None
#             ,p_tag = None
#             ,sku_str = '111')


#         #.ln: exist store_product_x
#         #.ln_sp
#         ln_1_sp = store_product_couch_getter.exe(store_product_x.product.id,store_product_x.store.id)
#         #.ln
#         ln_1_qty = 1
#         ln_1_price = 1.1
#         ln_1_discount = 1.2
#         ln_1_non_product_name = None
#         ln_1_cost = 1.3
#         ln_1_mm_deal = None        
#         ln_1 = receipt_ln_constructor_for_test_purpose.exe(ln_1_qty,ln_1_price,ln_1_discount,ln_1_sp,ln_1_non_product_name,ln_1_cost,ln_1_mm_deal)


#         #RECEIPT
#         collect_amount = 100
#         tax_rate = 9.75
#         time_stamp = 1
#         ds_lst = [ln_1]
#         receipt_inserter_for_test_purpose.exe(collect_amount,ds_lst,tax_rate,time_stamp,store.id)


#         #ASSERT INSERTION
#         receipt_lst = receipt_lst_couch_getter.exe(store.id)
#         self.assertEqual(len(receipt_lst),1)


#     def can_stop_reg_user_to_insert_none_receipt_document(self):
#         # xxx reimplement test
#         #foreman  run -e .env,test.env python manage.py test test.couch.couch_acl_validator_test:Test.can_stop_reg_user_to_insert_none_receipt_document
#         user,store = test_helper.create_user_then_store()

#         db = couch_util.get_store_db_use_store_account(store.id,store.api_key_name,store.api_key_pwrd)
#         try:
#             a_none_type_doc = {'a':'a'}
#             db.save(a_none_type_doc)
#         except Unauthorized,err:
#             error_type,error_message = err.message
#             self.assertEqual(error_type,'unauthorized')
#             self.assertEqual(error_message,couch_acl_validator.REGULAR_USER_PERFORM_INSERT_DOCUMENT_OTHER_THAN_RECEIPT_IS_NOT_ALLOW)

#         try:
#             type_doc = {'d_type':'x_type'}
#             db.save(a_none_type_doc)
#         except Unauthorized,err:
#             error_type,error_message = err.message
#             self.assertEqual(error_type,'unauthorized')
#             self.assertEqual(error_message,couch_acl_validator.REGULAR_USER_PERFORM_INSERT_DOCUMENT_OTHER_THAN_RECEIPT_IS_NOT_ALLOW)


#     def can_stop_reg_user_to_delete_document(self):
#         # xxx reimplement test
#         #foreman  run -e .env,test.env python manage.py test test.couch.couch_acl_validator_test:Test.can_stop_reg_user_to_delete_document
#         user,store = test_helper.create_user_then_store()

#         #.insert new store_product_x
#         store_product_x = insert_new.exe(
#              store_id = store.id            
#             ,name = 'product name'
#             ,price = 0.1
#             ,crv = 0.2
#             ,is_taxable = True
#             ,is_sale_report = True
#             ,p_type = None
#             ,p_tag = None
#             ,sku_str = '111'
#         )


#         #.ln: exist store_product_x
#         #.ln_sp
#         ln_1_sp = store_product_couch_getter.exe(store_product_x.product.id,store_product_x.store.id)
#         #.ln
#         ln_1_qty = 1
#         ln_1_price = 1.1
#         ln_1_discount = 1.2
#         ln_1_non_product_name = None
#         ln_1_cost = 1.3
#         ln_1_mm_deal = None
#         ln_1 = receipt_ln_constructor_for_test_purpose.exe(ln_1_qty,ln_1_price,ln_1_discount,ln_1_sp,ln_1_non_product_name,ln_1_cost,ln_1_mm_deal)


#         #RECEIPT
#         collect_amount = 100
#         tax_rate = 9.75
#         time_stamp = 1
#         ds_lst = [ln_1]
#         receipt_inserter_for_test_purpose.exe(collect_amount,ds_lst,tax_rate,time_stamp,store.id)


#         #ASSERT INSERTION
#         receipt_lst = receipt_lst_couch_getter.exe(store.id)
#         self.assertEqual(len(receipt_lst),1)


#         #ASSERT CAN NOT DELETE
#         receipt = receipt_lst[0]
#         receipt['_deleted'] = True

#         db = couch_util.get_store_db_use_store_account(store.id,store.api_key_name,store.api_key_pwrd)
#         try:
#             db.save(receipt)
#         except Unauthorized,err:
#             error_type,error_message = err.message
#             self.assertEqual(error_type,'unauthorized')
#             self.assertEqual(error_message,couch_acl_validator.REGULAR_USER_PERFORM_DELETE_IS_NOT_ALLOW)


#     def can_stop_reg_user_to_update_document(self):
#         # xxx reimplement test
#         #foreman  run -e .env,test.env python manage.py test test.couch.couch_acl_validator_test:Test.can_stop_reg_user_to_update_document
#         user,store = test_helper.create_user_then_store()

#         #.insert new store_product_x
#         store_product_x = insert_new.exe(
#              store_id = store.id
#             ,name = 'product name'
#             ,price = 0.1
#             ,crv = 0.2
#             ,is_taxable = True
#             ,is_sale_report = True
#             ,p_type = None
#             ,p_tag = None
#             ,sku_str = '111')


#         #.ln: exist store_product_x
#         #.ln_sp
#         ln_1_sp = store_product_couch_getter.exe(store_product_x.product.id,store_product_x.store.id)
#         #.ln
#         ln_1_qty = 1
#         ln_1_price = 1.1
#         ln_1_discount = 1.2
#         ln_1_non_product_name = None
#         ln_1_cost = 1.3
#         ln_1_mm_deal = None
#         ln_1 = receipt_ln_constructor_for_test_purpose.exe(ln_1_qty,ln_1_price,ln_1_discount,ln_1_sp,ln_1_non_product_name,ln_1_cost,ln_1_mm_deal)


#         #RECEIPT
#         collect_amount = 100
#         tax_rate = 9.75
#         time_stamp = 1
#         ds_lst = [ln_1]
#         receipt_inserter_for_test_purpose.exe(collect_amount,ds_lst,tax_rate,time_stamp,store.id)


#         #ASSERT INSERTION
#         receipt_lst = receipt_lst_couch_getter.exe(store.id)
#         self.assertEqual(len(receipt_lst),1)


#         #ASSERT CAN NOT UPDATE
#         receipt = receipt_lst[0]
#         receipt['collect_amount'] = 200

#         db = couch_util.get_store_db_use_store_account(store.id,store.api_key_name,store.api_key_pwrd)
#         try:
#             db.save(receipt)
#         except Unauthorized,err:
#             error_type,error_message = err.message
#             self.assertEqual(error_type,'unauthorized')
#             self.assertEqual(error_message,couch_acl_validator.REGULAR_USER_PERFORM_UPDATE_IS_NOT_ALLOW)
