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
        
        name = 'product name'
        price = 1.1
        crv = 1.2
        is_taxable = True
        is_sale_report = False
        p_type = 'type'
        p_tag = 'tag'
        sku_str = '111'
        cost = 1.3
        vendor = 'pitco'
        buydown = 1.4

        sp = new_sp_inserter.exe(
             store_id = store.id
            ,name = name
            ,price = price
            ,crv = crv
            ,is_taxable = is_taxable
            ,is_sale_report = is_sale_report
            ,p_type = p_type
            ,p_tag = p_tag
            ,sku_str = sku_str
            ,cost = cost
            ,vendor = vendor
            ,buydown = buydown
        )

        is_include_other_store = 'true'
        is_include_lookup_type_tag = 'true'

        res = self.app.get(
             '/product/search_by_pid'
            ,params={
                 'product_id' : sp.product.id
                ,'is_include_other_store' : is_include_other_store
                ,'is_include_lookup_type_tag' : is_include_lookup_type_tag
            }
            ,user=user
        )
        self.assertEqual(res.status_int,200)

        #assert response        
        prod_json = res.json['product']
        sp_json = sp_util.get_sp_json_from_product_json(prod_json,store.id)
        self.assertEqual(sp_json['product_id'],sp.product.id)
        self.assertEqual(sp_json['store_id'],store.id)
        self.assertEqual(sp_json['name'],name)
        self.assertEqual(sp_json['price'],str(price))
        self.assertEqual(sp_json['crv'],str(crv))
        self.assertEqual(sp_json['is_taxable'],is_taxable)
        self.assertEqual(sp_json['is_sale_report'],is_sale_report)
        self.assertEqual(sp_json['p_type'],p_type)
        self.assertEqual(sp_json['p_tag'],p_tag)
        self.assertEqual(sp_json['cost'],str(cost))
        self.assertEqual(sp_json['vendor'],vendor)        
        self.assertEqual(sp_json['buydown'],str(buydown))

        #lookup type tag
        lookup_type_tag = res.json['lookup_type_tag']
        self.assertTrue(lookup_type_tag != None)