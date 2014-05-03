from django_webtest import WebTest
from django.core.urlresolvers import reverse
from helper import test_helper
from store_product import new_sp_inserter

class test(WebTest):   
    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        #foreman  run -e .env,test.env python manage.py test test.store_product.sp_search_by_name_view_test:test.test

        product_name = 'ab'

        #FIXTURE TO CREATE PRODUCT WITH SAME NAME FOR OTHER STORE THAT WILL NOT BE INCLUDED IN MY STORE SEARCH
        other_user,other_store = test_helper.create_user_then_store()
        new_sp_inserter.exe(
             store_id = other_store.id
            ,name = product_name
            ,price = 1
            ,crv = 1
            ,is_taxable = True
            ,is_sale_report = False
            ,p_type = None
            ,p_tag = None
            ,sku_str = '1'
            ,cost = None
            ,vendor = None
            ,buydown = None
        )

        #FIXTURE TO CREATE PRODUCT WITH SAME NAME FOR MY STORE THAT WILL BE INCLUDED IN MY STORE SEARCH
        my_user,my_store = test_helper.create_user_then_store()
        my_price = 1.1
        my_crv = 1.2
        my_is_taxable = False
        my_is_sale_report = False
        my_p_type = 'type'
        my_p_tag = 'tag'
        my_cost = 1.3
        my_vendor = 'pitco'
        my_buydown = 1.4
        my_sp = new_sp_inserter.exe(
             store_id = my_store.id
            ,name = product_name
            ,price = my_price
            ,crv = my_crv
            ,is_taxable = my_is_taxable
            ,is_sale_report = my_is_sale_report
            ,p_type = my_p_type
            ,p_tag = my_p_tag
            ,sku_str = '2'
            ,cost = my_cost
            ,vendor = my_vendor
            ,buydown = my_buydown
        )

        #MAKE REQUEST TO SEARCH
        search_name_str = 'b'
        res = self.app.get(
             '/product/search_by_name'
            ,params={'name_str':search_name_str}
            ,user=my_user
        )
        self.assertEqual(res.status_int,200)
        
        #product list
        prod_json_lst = res.json['prod_lst']
        self.assertEqual(len(prod_json_lst),1)
        
        prod_json = prod_json_lst[0]
        sp_json_lst = prod_json['store_product_set']
        self.assertEqual(len(sp_json_lst),1)
        
        sp_json = sp_json_lst[0]
        self.assertEqual(sp_json['product_id'],my_sp.product.id)
        self.assertEqual(sp_json['store_id'],my_store.id)
        self.assertEqual(sp_json['name'],product_name)
        self.assertEqual(sp_json['price'],str(my_price))
        self.assertEqual(sp_json['crv'],str(my_crv))
        self.assertEqual(sp_json['is_taxable'],my_is_taxable)
        self.assertEqual(sp_json['is_sale_report'],my_is_sale_report)
        self.assertEqual(sp_json['p_type'],my_p_type)
        self.assertEqual(sp_json['p_tag'],my_p_tag)
        self.assertEqual(sp_json['cost'],str(my_cost))
        self.assertEqual(sp_json['vendor'],my_vendor)      
        self.assertEqual(sp_json['buydown'],str(my_buydown))

        #lookup type tag
        self.assertTrue('lookup_type_tag' not in res.json)




