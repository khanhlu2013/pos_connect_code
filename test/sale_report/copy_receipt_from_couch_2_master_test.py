from django_webtest import WebTest
from helper import test_helper
from store_product import new_sp_inserter
from sale.sale_couch.receipt import receipt_inserter_for_test_purpose,receipt_lst_couch_getter,receipt_ln_constructor_for_test_purpose
from store_product.sp_couch import store_product_couch_getter
from store_product.sp_couch.document import Store_product_document
from receipt import receipt_master_getter
from receipt import copy_receipt_from_couch_2_master
from decimal import Decimal
from couch import couch_constance
import time


class test(WebTest):

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def can_cut_paste_receipt_from_couch_to_master(self):
        """
            INTRO

                We save receipt local browser in pouch then cut and paste (save sale data to server) them up to couch. 
                When we view sale report in master, we will cut paste receipt from couch to master and that is the purpose of the function we are trying to test.

            FIXTURE
                use new_sp_inserter to insert to master and couch a sp
                use this sp to insert into couch a receipt with only 1 line
                
            RUN TEST CODE                

            ASSERT
                assert receipt in couch is deleted
                assert receipt in master is saved correctly
                assert receipt ln in master is saved correctly
        """
        #foreman  run -e .env,test.env python manage.py test test.sale.copy_receipt_from_couch_2_master_test:test.can_cut_paste_receipt_from_couch_to_master

        #-FIXTURE

        user,store = test_helper.create_user_then_store()

        #-use new_sp_inserter to insert to master and couch a sp
        name = 'product name'
        price = 1.1             #we don't care about this price since we use override price in receipt_ln
        crv = 1.2               #we care about this since we use this sp info for stamping
        is_taxable = True
        is_sale_report = True   
        p_type = 'type'         #we care about this since we use this sp info for stamping
        p_tag = 'tag'           #we care about this since we use this sp info for stamping
        cost = 1.3              #we care about this since we use this sp info for stamping
        buydown = 1.4           #we care about this since we use this sp info for stamping

        sp_master = new_sp_inserter.exe(
             store_id = store.id            
            ,name = name
            ,price = price
            ,crv = crv
            ,is_taxable = is_taxable
            ,is_sale_report = is_sale_report
            ,p_type = p_type
            ,p_tag = p_tag
            ,sku_str = '111'
            ,cost = cost
            ,vendor = None
            ,buydown = buydown
        )    

        #-use this sp to insert into couch a receipt with only 1 line
        ln_1_sp = store_product_couch_getter.exe(sp_master.product.id,store.id)
        ln_1_qty = 1
        ln_1_price = 1.1
        ln_1_discount = 1.2
        ln_1_non_product_name = None
        ln_1_cost = 1.3
        ln_1_mm_deal = None
        ln_1 = receipt_ln_constructor_for_test_purpose.exe(
             qty = ln_1_qty
            ,price = ln_1_price
            ,discount = ln_1_discount
            ,store_product = ln_1_sp
            ,non_product_name = ln_1_non_product_name
            ,cost = ln_1_cost
            ,mix_match_deal = ln_1_mm_deal
        )

        tender_lst = []
        ds_lst = [ln_1,]
        tax_rate = 1
        time_stamp = 32 * 1000

        receipt_inserter_for_test_purpose.exe(
             tender_lst = tender_lst
            ,ds_lst = ds_lst
            ,tax_rate = tax_rate
            ,time_stamp = time_stamp
            ,store_id = store.id
            ,api_key_name = store.api_key_name
            ,api_key_pwrd = store.api_key_pwrd
        )   


        #-RUN TEST CODE
        copy_receipt_from_couch_2_master.exe(store.id)


        #-ASSERT 

        #-assert receipt in couch is deleted
        receipt_couch_lst = receipt_lst_couch_getter.exe(store.id)
        self.assertEqual(len(receipt_couch_lst),0)        


        #-assert receipt in master is saved correctly
        receipt_master_lst = Receipt.objects.filter(store_id=store.id).prefetch_related('receipt_ln_set')
        self.assertEqual(len(receipt_master_lst),1)
        receipt = receipt_master_lst[0]
        self.assertEqual(int(time.mktime(receipt.time_stamp.timetuple())*1000),time_stamp)
        self.assertEqual(receipt.collect_amount,Decimal(collect_amount))
        self.assertEqual(receipt.tax_rate,Decimal(tax_rate))
        self.assertEqual(receipt.store.id,store.id)


        #-assert receipt ln in master is saved correct
        receipt_ln_lst = receipt.receipt_ln_set.all()
        self.assertEqual(len(receipt_ln_lst),1)
        receipt_ln = receipt_ln_lst[0]
        self.assertEqual(receipt_ln.receipt.id,receipt.id)
        self.assertEqual(receipt_ln.qty,ln_1_qty)
        self.assertEqual(receipt_ln.price,Decimal(str(ln_1_price)))
        self.assertEqual(receipt_ln.crv,Decimal(str(crv)))
        self.assertEqual(receipt_ln.discount,Decimal(str(ln_1_discount)))
        self.assertEqual(receipt_ln.non_product_name,ln_1_non_product_name)
        self.assertEqual(receipt_ln.is_taxable,is_taxable)
        self.assertEqual(receipt_ln.p_type,p_type)
        self.assertEqual(receipt_ln.p_tag,p_tag)
        self.assertEqual(receipt_ln.cost,cost)
        self.assertEqual(receipt_ln.buydown,buydown)

