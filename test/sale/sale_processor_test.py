from django_webtest import WebTest
from decimal import Decimal
from model_mommy import mommy
from store_product import insert_new_store_product_cm
from helper import test_helper
from sale.couch.receipt import receipt_inserter_for_test_purpose,receipt_lst_couch_getter,receipt_ln_creator_for_test_purpose
from sale import sale_processor
from sale.receipt import receipt_lst_master_getter
from store_product.models import Store_product
from store_product.couch import store_product_couch_getter
from util.couch import couch_constance


class sale_processor_test(WebTest):
    
    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def can_process_exist_store_product_test(self):
        # xxx test failed
        #foreman  run -e .env,test.env python manage.py test test.sale.sale_processor_test:sale_processor_test.can_process_exist_store_product_test
        """
            #-INSERT FIXTURE: setup a store product, and insert into couch a receipt which contain only this store product, no assoc will be needed to process this receipt
            #.insert my_user,my_store
            #.insert a dummy_approve_product_z
            #.insert an approve_product_y
            #.insert new store_product_x
            #.insert a receipt into couch(we simulate upload receipt from pouch)
                #.receipt_ln_1.product : exist store_product_x
                #.receipt_ln_2.product : create old approve_product_y
                #.receipt_ln_3.product : create new


            #-SETUP TEST: execute sale_processor

            #-ASSERT RESULT: receipt info from couch is move into master
            #.assert receipt in couch is delete
            #.assert receipt in master is created correctly
            #.assert no new store product is created
        """
        #-INSERT FIXTURE: setup a store product, and insert into couch a receipt which contain only this store product, no assoc will be needed to process this receipt
        
        #.insert my_user,my_store
        my_user,my_store = test_helper.create_user_then_store()



        #.insert a dummy_approve_product_z
        dummy_approve_product_z = test_helper.createProductWithSku('999',is_approve_override=True)   



        #.insert an approve_product_y
        approve_product_sku_str = '222'
        approve_product_y = test_helper.createProductWithSku(approve_product_sku_str,is_approve_override=True)        


        #.insert new store_product_x
        name_x = 'product name'
        price_x = 0.1
        crv_x = 0.2
        isTaxable_x = True
        isTaxReport = True
        isSaleReport = True
        sku_str = '111'
        store_product_x = insert_new_store_product_cm.exe(
             name = name_x
            ,price = price_x
            ,crv = crv_x
            ,isTaxable = isTaxable_x
            ,isTaxReport = isTaxReport
            ,isSaleReport = isSaleReport
            ,business_id = my_store.id
            ,sku_str = sku_str)



        #.ln_1: exist store_product_x
        #.ln_1_sp
        ln_1_sp = store_product_couch_getter.exe(store_product_x.product.id,store_product_x.business.id)
        #.ln_1
        ln_1_qty = 1
        ln_1_price = 1.1
        ln_1_discount = 1.2
        ln_1_non_product_name = None
        ln_1 = receipt_ln_creator_for_test_purpose.exe(ln_1_qty,ln_1_price,ln_1_discount,ln_1_sp,ln_1_non_product_name)



        #.ln_2: create offline by old store_product: approve_product_y
        #.ln_2_sp
        ln_2_sp_id = 'ln_2_sp_id'
        ln_2_sp_name = 'sp_2_name'
        ln_2_sp_price = 2.1
        ln_2_sp_crv =  2.2
        ln_2_sp_is_taxable = True
        ln_2_sp_sku_lst = [approve_product_sku_str]
        ln_2_sp_create_offline_by_sku = approve_product_sku_str
        ln_2_sp = create_pouch_offline_store_product(ln_2_sp_id,approve_product_y.id,ln_2_sp_name,ln_2_sp_price,ln_2_sp_crv,ln_2_sp_is_taxable,ln_2_sp_sku_lst,ln_2_sp_create_offline_by_sku)
        #.ln_2
        ln_2_qty = 2
        ln_2_price = 2.3
        ln_2_discount = 2.4
        ln_2_non_product_name = None
        ln_2 = receipt_ln_creator_for_test_purpose.exe(ln_2_qty,ln_2_price,ln_2_discount,ln_2_sp,ln_2_non_product_name)

        

        #.ln_3: create offline by new store_product
        #.ln_3_sp
        ln_3_pid = None
        ln_3_sku_str = '333'
        ln_3_sp_id = 'ln_3_sp_id'
        ln_3_sp_name = 'sp_3_name'
        ln_3_sp_price = 3.1
        ln_3_sp_crv =  3.2
        ln_3_sp_is_taxable = False
        ln_3_sp_sku_lst = [ln_3_sku_str]
        ln_3_sp_create_offline_by_sku = ln_3_sku_str
        ln_3_sp = create_pouch_offline_store_product(ln_3_sp_id,ln_3_pid,ln_3_sp_name,ln_3_sp_price,ln_3_sp_crv,ln_3_sp_is_taxable,ln_3_sp_sku_lst,ln_3_sp_create_offline_by_sku)
        #.ln_2
        ln_3_qty = 3
        ln_3_price = 3.3
        ln_3_discount = 3.4
        ln_3_non_product_name = None
        ln_3 = receipt_ln_creator_for_test_purpose.exe(ln_3_qty,ln_3_price,ln_3_discount,ln_3_sp,ln_3_non_product_name)



        #.ln_4: a none product
        #.ln_4_sp
        ln_4_sp = None
        #.ln_2
        ln_4_qty = 2
        ln_4_price = 2.3
        ln_4_discount = 2.4
        ln_4_non_product_name = 'A non product'
        ln_4 = receipt_ln_creator_for_test_purpose.exe(ln_4_qty,ln_4_price,ln_4_discount,ln_4_sp,ln_4_non_product_name)



        #.insert a receipt
        collected_amount = 100
        tax_rate = 9.75
        time_stamp = 1
        ds_lst = []
        ds_lst.append(ln_1)
        ds_lst.append(ln_2)
        ds_lst.append(ln_3)
        ds_lst.append(ln_4)
        receipt_inserter_for_test_purpose.exe(collected_amount,ds_lst,tax_rate,time_stamp,my_store.id)
        receipt_couch_lst = receipt_lst_couch_getter.exe(my_store.id)
        self.assertEqual(len(receipt_couch_lst),1)



        #-SETUP TEST: execute sale_processor
        sale_processor.exe(my_store.id)



        #-ASSERT RESULT: 
        #.assert receipt in couch is delete
        receipt_couch_lst = receipt_lst_couch_getter.exe(my_store.id)
        self.assertEqual(len(receipt_couch_lst),0)



        #.master.receipt
        receipt_master_lst = receipt_lst_master_getter.exe(my_store.id)
        self.assertEqual(len(receipt_master_lst),1)
        receipt = receipt_master_lst[0]
        self.assertEqual(receipt.time_stamp,time_stamp)
        self.assertEqual(receipt.collect_amount,collected_amount)
        self.assertEqual(tax_rate,tax_rate)
        self.assertTrue(receipt.id!=None)
        #master.receipt_ln
        receipt_ln_lst = list(receipt.receipt_ln_lst.all())
        self.assertEqual(len(receipt_ln_lst),4)



        #master.receipt_ln_1
        ln_1 = receipt_ln_lst[0]
        self.assertEqual(ln_1.qty,ln_1_qty)
        self.assertEqual(ln_1.price,Decimal(str(ln_1_price)))
        self.assertEqual(ln_1.discount,Decimal(str(ln_1_discount)))
        self.assertEqual(ln_1.store_product.crv,Decimal(str(crv_x)))
        self.assertEqual(ln_1.store_product.isTaxable,isTaxable_x)



        #master.receipt_ln_2
        ln_2 = receipt_ln_lst[1]
        self.assertEqual(ln_2.qty,ln_2_qty)
        self.assertEqual(ln_2.price,Decimal(str(ln_2_price)))
        self.assertEqual(ln_2.discount,Decimal(str(ln_2_discount)))
        self.assertEqual(ln_2.store_product.crv,Decimal(str(ln_2_sp_crv)))
        self.assertEqual(ln_2.store_product.isTaxable,ln_2_sp_is_taxable)



        #master.receipt_ln_3
        ln_3 = receipt_ln_lst[2]
        self.assertEqual(ln_3.qty,ln_3_qty)
        self.assertEqual(ln_3.price,Decimal(str(ln_3_price)))
        self.assertEqual(ln_3.discount,Decimal(str(ln_3_discount)))
        self.assertEqual(ln_3.store_product.crv,Decimal(str(ln_3_sp_crv)))
        self.assertEqual(ln_3.store_product.isTaxable,ln_3_sp_is_taxable)



        #master.receipt_ln_4
        ln_4 = receipt_ln_lst[3]
        self.assertEqual(ln_4.qty,ln_4_qty)
        self.assertEqual(ln_4.price,Decimal(str(ln_4_price)))
        self.assertEqual(ln_4.discount,Decimal(str(ln_4_discount)))
        self.assertEqual(ln_4.store_product,None)
        self.assertEqual(ln_4.non_product_name,ln_4_non_product_name)



        #.assert master store product
        sp_lst = list(Store_product.objects.all())
        self.assertEqual(len(sp_lst),3)





def create_pouch_offline_store_product(_id,product_id,name,price,crv,is_taxable,sku_lst,create_offline_by_sku):
    return {
         '_id' : _id
        ,'d_type' : couch_constance.STORE_PRODUCT_DOCUMENT_TYPE
        ,'product_id' : product_id
        ,'name' : name
        ,'price' : price
        ,'crv' : crv
        ,'is_taxable' : is_taxable
        ,'sku_lst' : sku_lst
        ,'create_offline' : True
        ,'create_offline_by_sku' : create_offline_by_sku
    }
