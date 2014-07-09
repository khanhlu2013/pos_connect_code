from django_webtest import WebTest
from helper import test_helper
from store_product import sp_serializer
import json

class test(WebTest):
    csrf_checks = False
    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        #foreman  run -e .env,test.env python manage.py test test.store_product.angular.sp_kit_update_angular_view_test:test.test
        user,store = test_helper.create_user_then_store()

        sp_a = test_helper.insert_new_sp(store_id=store.id)
        sp_b = test_helper.insert_new_sp(store_id=store.id)

        #create a json of product a and make it a kit containing product b as breakdown
        sp_a_json = sp_serializer.Store_product_serializer(sp_a).data
        sp_b_json = sp_serializer.Store_product_serializer(sp_b).data
        assoc_qty = 3
        assoc_json = {'breakdown':sp_b_json,'qty':assoc_qty}
        sp_a_json['breakdown_assoc_lst'] = [assoc_json,]

        response = self.app.post('/product/kit/update_angular',{'sp':json.dumps(sp_a_json)},user=user)
        self.assertEqual(response.status_int,200)
        res_json = response.json
        self.assertEqual(len(res_json['breakdown_assoc_lst']),1)

        kit_json = res_json
        assoc_json = res_json['breakdown_assoc_lst'][0]
        self.assertEqual(sp_a.product.id,kit_json['product_id'])
        self.assertEqual(assoc_json['breakdown']['product_id'],sp_b.product.id)
        self.assertEqual(assoc_json['qty'],assoc_qty)
