from django_webtest import WebTest
from helper import test_helper
from sale.sale_couch.receipt import receipt_inserter_for_test_purpose,receipt_lst_couch_getter,receipt_ln_constructor_for_test_purpose
from store_product.sp_couch import store_product_couch_getter,store_product_document_constructor_for_test_purpose
from store_product.sp_couch.document import Store_product_document
from decimal import Decimal
from couch import couch_constance,couch_util
import time
from store_product.create_new_sp_for_receipt_ln import create_new_sp_for_receipt_ln
from store_product import store_product_master_getter

class test(WebTest):

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        """
            INTRO
                after client push receipt up to master, it also request that receipt ln having sp with null pid to be created so that offline created product is available. this test verify that

            STRATEGY / FIXTURE    
                prepare 2 new sp documents, both have null pid and different sp_doc_id 
                    . sp_a
                    . sp_b

                create 2 receipts 
                    .receipt 1 
                        .ln1: sp_a

                    .receipt 2
                        .ln1: sp_a
                        .ln2: sp_b
                        .ln3: sp_a

            
            RUN TEST CODE    
            
            ASSERT
                . 2 pid is created
                . receipt_ln is updated: each unique sp_doc_id having a unique pid

        """
        #foreman  run -e .env,test.env python manage.py test test.store_product.create_new_sp_for_receipt_ln_test:test.test

        #-CREATE USER AND STORE
        user,store = test_helper.create_user_then_store()

        #-FIXTURE

        # sp_a
        sp_a_doc_id = 1
        sp_a_name = 'product a'
        sp_a_price = 1.1
        sp_a_crv = 1.2
        sp_a_is_taxable = True
        sp_a_is_sale_report = True
        sp_a_p_type = 'type_a'
        sp_a_p_tag = 'tag_a'
        sp_a_sku_str = '111'
        sp_a_cost = 1.3
        sp_a_vendor = 'vendor_a'
        sp_a_buydown = 1.4
        sp_a_doc = store_product_document_constructor_for_test_purpose.exe(
             sp_doc_id = sp_a_doc_id
            ,store_id = store.id
            ,product_id = None
            ,name = sp_a_name
            ,price = sp_a_price
            ,crv = sp_a_crv
            ,is_taxable = sp_a_is_taxable
            ,is_sale_report = sp_a_is_sale_report
            ,p_type = sp_a_p_type
            ,p_tag = sp_a_p_tag
            ,sku_lst = [sp_a_sku_str,]
            ,cost = sp_a_cost
            ,vendor = sp_a_vendor       
            ,buydown = sp_a_buydown
        )

        # sp_b
        sp_b_doc_id = 2
        sp_b_name = 'product b'
        sp_b_price = 2.1
        sp_b_crv = 2.2
        sp_b_is_taxable = True
        sp_b_is_sale_report = True
        sp_b_p_type = 'type_b'
        sp_b_p_tag = 'tag_b'
        sp_b_sku_str = '222'
        sp_b_cost = 2.3
        sp_b_vendor = 'vendor_b'
        sp_b_buydown = 2.4
        sp_b_doc = store_product_document_constructor_for_test_purpose.exe( \
             sp_doc_id = sp_b_doc_id
            ,store_id = store.id
            ,product_id = None
            ,name = sp_b_name
            ,price = sp_b_price
            ,crv = sp_b_crv
            ,is_taxable = sp_b_is_taxable
            ,is_sale_report = sp_b_is_sale_report
            ,p_type = sp_b_p_type
            ,p_tag = sp_b_p_tag
            ,sku_lst = [sp_b_sku_str,]
            ,cost = sp_b_cost
            ,vendor = sp_b_vendor      
            ,buydown = sp_b_buydown 
        )

        tax_rate = 1
        time_stamp = 1

        #RECEIPT 1
        r1_l1 = receipt_ln_constructor_for_test_purpose.exe(qty=1,price=1,discount=1,non_product_name=None,cost=1,mm_deal_info=None,store_product = sp_a_doc)
        receipt_inserter_for_test_purpose.exe(collect_amount=1,tax_rate=tax_rate,time_stamp=time_stamp,store_id=store.id,api_key_name=store.api_key_name,api_key_pwrd=store.api_key_pwrd
            ,ds_lst = [r1_l1,])


        #RECEIPT 2
        r2_l1 = receipt_ln_constructor_for_test_purpose.exe(qty=1,price=1,discount=1,non_product_name=None,cost=1,mm_deal_info=None,store_product = sp_a_doc)
        r2_l2 = receipt_ln_constructor_for_test_purpose.exe(qty=1,price=1,discount=1,non_product_name=None,cost=1,mm_deal_info=None,store_product = sp_b_doc)
        r2_l3 = receipt_ln_constructor_for_test_purpose.exe(qty=1,price=1,discount=1,non_product_name=None,cost=1,mm_deal_info=None,store_product = sp_a_doc)
        receipt_inserter_for_test_purpose.exe(collect_amount=1,tax_rate=tax_rate,time_stamp=time_stamp,store_id=store.id,api_key_name=store.api_key_name,api_key_pwrd=store.api_key_pwrd
            ,ds_lst = [r2_l1,r2_l2,r2_l3])


        #RUN TEST CODE
        create_new_sp_for_receipt_ln.exe(store.id)

        #ASSERT
        receipt_couch_lst = receipt_lst_couch_getter.exe(store.id)
        self.assertEqual(len(receipt_couch_lst),2)
        r1 = receipt_couch_lst[0]
        r2 = receipt_couch_lst[1]
        self.assertEqual(len(r1['ds_lst']),1)
        self.assertEqual(len(r2['ds_lst']),3)

        #assert pid is assign accordingly to sp_doc_id
        pid_a = r1['ds_lst'][0]['store_product']['product_id']
        pid_b = r2['ds_lst'][1]['store_product']['product_id']
        self.assertTrue(pid_a!=None)
        self.assertTrue(pid_b!=None)
        self.assertTrue(pid_a!=pid_b)
        self.assertEqual(r2['ds_lst'][0]['store_product']['product_id'],pid_a)
        self.assertEqual(r2['ds_lst'][2]['store_product']['product_id'],pid_a)

        #assert sp a in master
        sp_a = store_product_master_getter.get_item(product_id=pid_a,store_id=store.id)
        self.assertEqual(sp_a.name,sp_a_name)
        self.assertEqual(couch_util.decimal_2_str(sp_a.price),str(sp_a_price))
        self.assertEqual(couch_util.decimal_2_str(sp_a.crv),str(sp_a_crv))
        self.assertEqual(sp_a.is_taxable,sp_a_is_taxable)
        self.assertEqual(sp_a.is_sale_report,sp_a_is_sale_report)
        self.assertEqual(sp_a.p_type,sp_a_p_type)
        self.assertEqual(sp_a.p_tag,sp_a_p_tag)
        sp_a_sku_lst = sp_a.product.sku_set.all()
        self.assertEqual(len(sp_a_sku_lst),1)
        self.assertEqual(sp_a_sku_lst[0].sku,sp_a_sku_str)
        self.assertEqual(couch_util.decimal_2_str(sp_a.cost),str(sp_a_cost))
        self.assertEqual(sp_a.vendor,sp_a_vendor)
        self.assertEqual(couch_util.decimal_2_str(sp_a.buydown),str(sp_a_buydown))


        #assert sp b in master
        sp_b = store_product_master_getter.get_item(product_id=pid_b,store_id=store.id)
        self.assertEqual(sp_b.name,sp_b_name)
        self.assertEqual(couch_util.decimal_2_str(sp_b.price),str(sp_b_price))
        self.assertEqual(couch_util.decimal_2_str(sp_b.crv),str(sp_b_crv))
        self.assertEqual(sp_b.is_taxable,sp_b_is_taxable)
        self.assertEqual(sp_b.is_sale_report,sp_b_is_sale_report)
        self.assertEqual(sp_b.p_type,sp_b_p_type)
        self.assertEqual(sp_b.p_tag,sp_b_p_tag)
        sp_b_sku_lst = sp_b.product.sku_set.all()
        self.assertEqual(len(sp_b_sku_lst),1)
        self.assertEqual(sp_b_sku_lst[0].sku,sp_b_sku_str)
        self.assertEqual(couch_util.decimal_2_str(sp_b.cost),str(sp_b_cost))
        self.assertEqual(sp_b.vendor,sp_b_vendor)
        self.assertEqual(couch_util.decimal_2_str(sp_b.buydown),str(sp_b_buydown))