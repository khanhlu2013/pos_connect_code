from django_webtest import WebTest
from helper import test_helper
import json
from store_product import sp_kit_update_cm
from store_product.models import Store_product
from store_product.sp_couch import store_product_couch_getter


class test(WebTest):   
    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        """
            foreman  run -e .env,test.env python manage.py test test.store_product.sp_kit_update_test:test.test

            DESC: 
                . this test don't cover infinite recursive where a breakdown in a tree is also a parent somewhere above the tree ( cover in sp_model_test )
                . this test only test a simplest case of updating kit by verifying master and couch data
        """        
        user,store = test_helper.create_user_then_store()

        kit_sp = test_helper.insert_new_sp(store.id)
        bd_1_sp = test_helper.insert_new_sp(store.id)
        bd_2_sp = test_helper.insert_new_sp(store.id)
        
        breakdown_assoc_lst = []
        assoc_1 = {}
        assoc_2 = {}

        #assoc 1
        assoc_1_qty = 2
        assoc_1["breakdown_id"] = bd_1_sp.product.id
        assoc_1["qty"] = assoc_1_qty
        breakdown_assoc_lst.append(assoc_1)

        #assoc 2
        assoc_2_qty = 4
        assoc_2["breakdown_id"] = bd_2_sp.product.id
        assoc_2["qty"] = assoc_2_qty
        breakdown_assoc_lst.append(assoc_2)

        #RUN TEST CODE
        sp_kit_update_cm.exe(kit_id = kit_sp.id,store_id=store.id,breakdown_assoc_lst=breakdown_assoc_lst)

        #VERIFY
        #verify master
        kit_sp = Store_product.objects.get(pk=kit_sp.id)
        breakdown_assoc_lst = kit_sp.breakdown_assoc_lst.all()
        self.assertEqual(len(breakdown_assoc_lst),2)
        self.assertEqual(breakdown_assoc_lst[0].breakdown.id,bd_1_sp.id)
        self.assertEqual(breakdown_assoc_lst[0].qty,assoc_1_qty)
        self.assertEqual(breakdown_assoc_lst[1].breakdown.id,bd_2_sp.id)
        self.assertEqual(breakdown_assoc_lst[1].qty,assoc_2_qty)

        #verify couch
        sp_couch = store_product_couch_getter.exe(store_id=store.id,product_id=kit_sp.id)
        self.assertEqual(len(sp_couch['breakdown_assoc_lst']),2)
        self.assertEqual(sp_couch['breakdown_assoc_lst'][0]['breakdown_id'],bd_1_sp.product.id)
        self.assertEqual(sp_couch['breakdown_assoc_lst'][0]['qty'],assoc_1_qty)
        self.assertEqual(sp_couch['breakdown_assoc_lst'][1]['breakdown_id'],bd_2_sp.product.id)
        self.assertEqual(sp_couch['breakdown_assoc_lst'][1]['qty'],assoc_2_qty)

