from django_webtest import WebTest
from model_mommy import mommy
from helper import test_helper
from couch import couch_util,couch_constance
from couchdb.http import ServerError
from sale.sale_couch.receipt import receipt_document_validator,document,receipt_ln_constructor_for_test_purpose,receipt_inserter_for_test_purpose,receipt_lst_couch_getter
from store_product.cm import insert_new
from store_product.sp_couch import store_product_couch_getter


# class receipt_document_validator_test(WebTest):
    
#     def setUp(self):
#         test_helper.setup_test_couchdb()

#     def tearDown(self):
#         test_helper.teardown_test_couchdb()

#     def can_validate_receipt_document_error_test(self):
#         #foreman  run -e .env,test.env python manage.py test test.sale.receipt.receipt_document_validator_test:receipt_document_validator_test.can_validate_receipt_document_error_test
#         user,store = test_helper.create_user_then_store()
#         db = couch_util.get_store_db(store.id)
#         dummy_receipt_doc = {'d_type':couch_constance.RECEIPT_DOCUMENT_TYPE}
        

#         try:
#             db.save(dummy_receipt_doc)
#         except ServerError,error_obj:
#             error_code, x = error_obj.message
#             error_type,error_message = x
            
#             self.assertEqual(error_code,403)
#             self.assertEqual(len(error_message.strip().split(' ')),4)
#             self.assertTrue(receipt_document_validator.ERROR_REQUIRE_TIME_STAMP in error_message)
#             self.assertTrue(receipt_document_validator.ERROR_REQUIRE_COLLECT_AMOUNT in error_message)
#             self.assertTrue(receipt_document_validator.ERROR_REQUIRE_DS_LST in error_message)
#             self.assertTrue(receipt_document_validator.ERROR_REQUIRE_TAX_RATE in error_message)


#     def can_validate_receipt_ln_lst_empty_error_test(self):
#         #foreman  run -e .env,test.env python manage.py test test.sale.receipt.receipt_document_validator_test:receipt_document_validator_test.can_validate_receipt_ln_lst_empty_error_test

#         user,store = test_helper.create_user_then_store()
#         db = couch_util.get_store_db(store.id)

#         receipt_doc = document.Receipt_document(
#              d_type = couch_constance.RECEIPT_DOCUMENT_TYPE
#             ,collect_amount = 1
#             ,ds_lst = []
#             ,tax_rate = 1
#             ,time_stamp = 1
#         )

#         try:
#             receipt_doc.store(db)
#         except ServerError,error_obj:
#             error_code, x = error_obj.message
#             error_type,error_message = x

#             self.assertEqual(error_code,403)
#             self.assertEqual(len(error_message.strip().split(' ')),1)
#             self.assertTrue(receipt_document_validator.ERROR_RECEIPT_LN_EMPTY in error_message)
           

#     def can_validate_receipt_ln_document_format_error_test(self):       
#         #foreman  run -e .env,test.env python manage.py test test.sale.receipt.receipt_document_validator_test:receipt_document_validator_test.can_validate_receipt_ln_document_format_error_test
#         user,store = test_helper.create_user_then_store()
#         db = couch_util.get_store_db(store.id)

#         receipt_doc = document.Receipt_document(
#              d_type = couch_constance.RECEIPT_DOCUMENT_TYPE
#             ,collect_amount = 1
#             ,ds_lst = [{'a':'a'}]
#             ,tax_rate = 1
#             ,time_stamp = 1
#         )

#         try:
#             receipt_doc.store(db)
#         except ServerError,error_obj:
#             error_code, x = error_obj.message
#             error_type,error_message = x

#             self.assertEqual(error_code,403)
#             self.assertEqual(len(error_message.strip().split(' ')),5)

#             self.assertTrue(receipt_document_validator.ERROR_RECEIPT_LN_QTY in error_message)
#             self.assertTrue(receipt_document_validator.ERROR_RECEIPT_LN_STORE_PRODUCT in error_message)
#             self.assertTrue(receipt_document_validator.ERROR_RECEIPT_LN_PRICE in error_message)
#             self.assertTrue(receipt_document_validator.ERROR_RECEIPT_LN_DISCOUNT in error_message)
#             self.assertTrue(receipt_document_validator.ERROR_RECEIPT_LN_NON_PRODUCT_NAME in error_message)

#     def can_validate_receipt_format_correct_test(self):
#         #foreman  run -e .env,test.env python manage.py test test.sale.receipt.receipt_document_validator_test:receipt_document_validator_test.can_validate_receipt_format_correct_test
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
#         ln_1_mm_deal_info = None

#         ln_1 = receipt_ln_constructor_for_test_purpose.exe(
#              qty = ln_1_qty
#             ,price = ln_1_price
#             ,discount = ln_1_discount
#             ,store_product = ln_1_sp
#             ,non_product_name = ln_1_non_product_name
#             ,cost = ln_1_cost
#             ,mm_deal_info = ln_1_mm_deal_info
#         )


#         #RECEIPT
#         collect_amount = 100
#         tax_rate = 9.75
#         time_stamp = 1
#         ds_lst = [ln_1]
#         receipt_inserter_for_test_purpose.exe(collect_amount,ds_lst,tax_rate,time_stamp,store.id)


#         #ASSERT INSERTION
#         receipt_lst = receipt_lst_couch_getter.exe(store.id)
#         self.assertEqual(len(receipt_lst),1)          



