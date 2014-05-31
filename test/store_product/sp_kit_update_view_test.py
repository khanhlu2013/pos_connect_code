from django_webtest import WebTest
from django.core.urlresolvers import reverse
from helper import test_helper
from store_product import new_sp_inserter,sp_util
from util import boolean
import json

class test(WebTest):   
    csrf_checks=False

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        """
            foreman  run -e .env,test.env python manage.py test test.store_product.sp_kit_update_view_test:test.test

            DESC: 
                . this test don't cover
                    . infinite recursive where a breakdown in a tree is also a parent somewhere above the tree ( cover in sp_model_test )
                    . verify couch and master data ( cover in sp_kit_update_cm_test )

                . this test only test a simplest case of updating kit, and test json response format
        """

        user,store = test_helper.create_user_then_store()
        kit_sp = test_helper.create_bare_sp(store.id)
        bd_1_sp = test_helper.create_bare_sp(store.id)
        bd_2_sp = test_helper.create_bare_sp(store.id)
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

        #make request
        data = {
             'kit_id' : kit_sp.product.id
            ,'breakdown_assoc_lst' : breakdown_assoc_lst
        }
        res = self.app.post(
             '/product/kit/update'
            ,json.dumps(data)
            ,user=user
        )
        self.assertEqual(res.status_int,200)

        #assert response
        prod_json = res.json
        self.assertTrue(prod_json!=None)
        sp_json = sp_util.get_sp_json_from_product_json(prod_json,store.id)
        self.assertEqual(len(sp_json['breakdown_assoc_lst']),2)
        
        #assoc_1
        res_assoc_1 = sp_json['breakdown_assoc_lst'][0]
        self.assertEqual(res_assoc_1['breakdown']['product_id'],bd_1_sp.product.id)
        self.assertEqual(res_assoc_1['qty'],assoc_1_qty)

        #assoc_2
        res_assoc_2 = sp_json['breakdown_assoc_lst'][1]
        self.assertEqual(res_assoc_2['breakdown']['product_id'],bd_2_sp.product.id)
        self.assertEqual(res_assoc_2['qty'],assoc_2_qty)


