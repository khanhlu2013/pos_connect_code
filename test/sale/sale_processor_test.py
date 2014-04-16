from django_webtest import WebTest
from helper import test_helper
from store_product import new_sp_inserter
from sale.sale_couch.receipt import receipt_inserter_for_test_purpose,receipt_lst_couch_getter,receipt_ln_creator_for_test_purpose
from store_product.sp_couch import store_product_couch_getter
from store_product.sp_couch.document import Store_product_document
from sale.receipt import receipt_lst_master_getter
from sale import sale_processor
from decimal import Decimal
from couch import couch_constance

class test(WebTest):

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    # def test(self):
    #     #foreman  run -e .env,test.env python manage.py test test.sale.sale_processor_test:test.test

    #     #-CREATE USER AND STORE
    #     user,store = test_helper.create_user_then_store()


    #     #-CREATE STORE PRODUCT

    #     name = 'product name'
    #     price = 1
    #     crv = 1
    #     is_taxable = True
    #     is_sale_report = True
    #     p_type = 'type'
    #     p_tag = 'tag'
    #     sku_str = '123'

    #     sp_master = new_sp_inserter.exe(
    #          store_id = store.id            
    #         ,name = name
    #         ,price = price
    #         ,crv = crv
    #         ,is_taxable = is_taxable
    #         ,is_sale_report = is_sale_report
    #         ,p_type = p_type
    #         ,p_tag = p_tag
    #         ,sku_str = sku_str
    #     )    


    #     #-SIMULATE RECEIPT PUSHER

    #     ln_1_sp = store_product_couch_getter.exe(sp_master.product.id,store.id)
    #     ln_1_qty = 1
    #     ln_1_price = 1.1
    #     ln_1_discount = 1.2
    #     ln_1_non_product_name = None
    #     ln_1 = receipt_ln_creator_for_test_purpose.exe(ln_1_qty,ln_1_price,ln_1_discount,ln_1_sp,ln_1_non_product_name)


    #     collect_amount = 1
    #     ds_lst = [ln_1,]
    #     tax_rate = 1
    #     time_stamp = 1

    #     receipt_inserter_for_test_purpose.exe(
    #          collected_amount = collect_amount
    #         ,ds_lst = ds_lst
    #         ,tax_rate = tax_rate
    #         ,time_stamp = time_stamp
    #         ,store_id = store.id
    #         ,api_key_name = store.api_key_name
    #         ,api_key_pwrd = store.api_key_pwrd
    #     )   


    #     #-RUN PROCESSOR CODE
    #     sale_processor.exe(store.id)


    #     #-ASSERT RECEIPT IN COUCH IS DELETED
    #     receipt_couch_lst = receipt_lst_couch_getter.exe(store.id)
    #     self.assertEqual(len(receipt_couch_lst),0)        


    #     #-ASSERT RECEIPT IS SAVED INTO MASTER
    #     receipt_master_lst = receipt_lst_master_getter.exe(store.id)
    #     self.assertEqual(len(receipt_master_lst),1)
    #     receipt = receipt_master_lst[0]
    #     # self.assertEqual(receipt.time_stamp,time_stamp)
    #     self.assertEqual(receipt.collect_amount,Decimal(collect_amount))
    #     self.assertEqual(receipt.tax_rate,Decimal(tax_rate))
    #     self.assertEqual(receipt.store.id,store.id)


    #     #-ASSERT RECEIPT LN IS SAVED INTO MASTER
    #     receipt_ln_lst = receipt.receipt_ln_set.all()
    #     self.assertEqual(len(receipt_ln_lst),1)
    #     receipt_ln = receipt_ln_lst[0]
    #     self.assertEqual(receipt_ln.receipt.id,receipt.id)
    #     self.assertEqual(receipt_ln.qty,ln_1_qty)
    #     self.assertEqual(receipt_ln.price,Decimal(str(ln_1_price)))
    #     self.assertEqual(receipt_ln.discount,Decimal(str(ln_1_discount)))
    #     self.assertEqual(receipt_ln.non_product_name,ln_1_non_product_name)



    def test(self):
        #foreman  run -e .env,test.env python manage.py test test.sale.sale_processor_test:test.test

        #-CREATE USER AND STORE
        user,store = test_helper.create_user_then_store()


        #-CREATE STORE PRODUCT

        name = 'product name'
        price = 1
        crv = 1
        is_taxable = True
        is_sale_report = True
        p_type = 'type'
        p_tag = 'tag'
        sku_str = '123'

        sp_master = new_sp_inserter.exe(
             store_id = store.id            
            ,name = name
            ,price = price
            ,crv = crv
            ,is_taxable = is_taxable
            ,is_sale_report = is_sale_report
            ,p_type = p_type
            ,p_tag = p_tag
            ,sku_str = sku_str
        )    


        #-SIMULATE RECEIPT PUSHER
        store_product_document = {
             '_id' : 1234 # a dummy sp._id that we pretent pouchdb created. we don't care because we delete offline create sp, and create it online to sync down again
            ,'d_type' : couch_constance.STORE_PRODUCT_DOCUMENT_TYPE
            ,'name' : name
            ,'price' : price
            ,'crv' : crv
            ,'is_taxable' : is_taxable
            ,'is_sale_report' : is_sale_report
            ,'p_type' : p_type
            ,'p_tag' : p_tag
            ,'sku_lst' : [sku_str,]
            ,'store_id' : store.id
            ,'product_id'  : None
        }


        ln_1_sp = store_product_document
        ln_1_qty = 1
        ln_1_price = 1.1
        ln_1_discount = 1.2
        ln_1_non_product_name = None
        ln_1 = receipt_ln_creator_for_test_purpose.exe(ln_1_qty,ln_1_price,ln_1_discount,ln_1_sp,ln_1_non_product_name)


        collect_amount = 1
        ds_lst = [ln_1,]
        tax_rate = 1
        time_stamp = 1

        receipt_inserter_for_test_purpose.exe(
             collected_amount = collect_amount
            ,ds_lst = ds_lst
            ,tax_rate = tax_rate
            ,time_stamp = time_stamp
            ,store_id = store.id
            ,api_key_name = store.api_key_name
            ,api_key_pwrd = store.api_key_pwrd
        )   


        #-RUN PROCESSOR CODE
        sale_processor.exe(store.id)


        #-ASSERT RECEIPT IN COUCH IS DELETED
        receipt_couch_lst = receipt_lst_couch_getter.exe(store.id)
        self.assertEqual(len(receipt_couch_lst),0)        


        #-ASSERT RECEIPT IS SAVED INTO MASTER
        receipt_master_lst = receipt_lst_master_getter.exe(store.id)
        self.assertEqual(len(receipt_master_lst),1)
        receipt = receipt_master_lst[0]
        # self.assertEqual(receipt.time_stamp,time_stamp)
        self.assertEqual(receipt.collect_amount,Decimal(collect_amount))
        self.assertEqual(receipt.tax_rate,Decimal(tax_rate))
        self.assertEqual(receipt.store.id,store.id)


        #-ASSERT RECEIPT LN IS SAVED INTO MASTER
        receipt_ln_lst = receipt.receipt_ln_set.all()
        self.assertEqual(len(receipt_ln_lst),1)
        receipt_ln = receipt_ln_lst[0]
        self.assertEqual(receipt_ln.receipt.id,receipt.id)
        self.assertEqual(receipt_ln.qty,ln_1_qty)
        self.assertEqual(receipt_ln.price,Decimal(str(ln_1_price)))
        self.assertEqual(receipt_ln.discount,Decimal(str(ln_1_discount)))
        self.assertEqual(receipt_ln.non_product_name,ln_1_non_product_name)

