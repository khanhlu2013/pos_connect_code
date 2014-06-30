from django_webtest import WebTest
from helper import test_helper

class test(WebTest):

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def only_search_name_within_our_store_test(self):
        """
            unfortunatedly we can not currenly test this code right now because when search for name, we don't use strictly django orm but we use extra clause that only work with postgres. and when test, we just sqlite which make it failed. if we can eliminate the custom sql , we can test this
            foreman  run -e .env,test.env python manage.py test test.store_product.angular.angular_product_page_search_by_name_test:test.only_search_name_within_our_store_test
        """
        # i,my_store = test_helper.create_user_then_store()
        # she,her_store = test_helper.create_user_then_store()
        # sku_str = '111'
        
        # my_sp = test_helper.insert_new_sp(store_id=my_store.id,name='my product name',sku_str=sku_str)
        # her_sp = test_helper.insert_old_sp(store_id=her_store.id,product_id=my_sp.product.id,name='her product name',sku_str=sku_str)

        # #TEST
        # response = self.app.get('/product/angular_product_page_search_by_name',params={'name_str':'her name'},user=i)
        # self.assertEqual(response.status_int,200)
        # sp_lst_json = response.json
        # self.assertEqual(len(sp_lst_json),0)
        pass




