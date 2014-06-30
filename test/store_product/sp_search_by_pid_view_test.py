from django_webtest import WebTest
from helper import test_helper
from store_product import new_sp_inserter,sp_util

class test(WebTest):   
    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        #foreman  run -e .env,test.env python manage.py test test.store_product.sp_search_by_pid_view_test:test.test

        user,store = test_helper.create_user_then_store()
        sp = test_helper.insert_new_sp(store.id)

        res = self.app.get(
             '/product/search_by_pid'
            ,params={
                 'product_id' : sp.product.id
                ,'is_include_other_store' : 'true'
            }
            ,user=user
        )
        self.assertEqual(res.status_int,200)

        #assert response        
        prod_json = res.json
        sp_json = sp_util.get_sp_json_from_product_json(prod_json,store.id)
        self.assertEqual(sp_json['product_id'],sp.product.id)
        self.assertEqual(sp_json['store_id'],store.id)
