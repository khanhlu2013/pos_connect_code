from django_webtest import WebTest
from django.core.urlresolvers import reverse
from helper import test_helper
from store_product import new_sp_inserter,sp_util
from util import boolean

class test(WebTest):   
    csrf_checks=False

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        #foreman  run -e .env,test.env python manage.py test test.store_product.sp_update_view_test:test.test

        user,store = test_helper.create_user_then_store()
        sp = new_sp_inserter.exe(
             store_id = store.id
            ,name = 'x'
            ,price = 1
            ,crv = None
            ,is_taxable = True
            ,is_sale_report = True
            ,p_type = None
            ,p_tag = None
            ,sku_str = '111'
            ,cost = None
            ,vendor = None
            ,buydown = None
        )

        name = 'my product name'
        price = 1.1
        crv = 1.2
        is_taxable = 'true'
        is_sale_report = 'true'
        p_type = 'type'
        p_tag = 'tag'
        cost = 1.3
        vendor = 'pitco'
        buydown = 1.4

        #make request
        data = {
             'product_id' : sp.product.id
            ,'name' : name
            ,'price' : price
            ,'crv' : crv
            ,'is_taxable' : is_taxable
            ,'is_sale_report' : is_sale_report
            ,'p_type' : p_type
            ,'p_tag' : p_tag
            ,'cost' : cost
            ,'vendor' : vendor
            ,'buydown' : buydown       
        }
        res = self.app.post(
             '/product/update_sp'
            ,data
            ,user=user
        )
        self.assertEqual(res.status_int,200)

        #assert response
        prod_json = res.json
        self.assertTrue(prod_json!=None)
        sp_json = sp_util.get_sp_json_from_product_json(prod_json,store.id)

        self.assertEqual(sp_json['store_id'],store.id)
        self.assertEqual(sp_json['name'],name)
        self.assertEqual(sp_json['price'],str(price))
        self.assertEqual(sp_json['crv'],str(crv))
        self.assertEqual(sp_json['is_taxable'],boolean.get_boolean_from_str(is_taxable))
        self.assertEqual(sp_json['is_sale_report'],boolean.get_boolean_from_str(is_sale_report))
        self.assertEqual(sp_json['p_type'],p_type)
        self.assertEqual(sp_json['p_tag'],p_tag)
        self.assertEqual(sp_json['cost'],str(cost))
        self.assertEqual(sp_json['vendor'],vendor)        
        self.assertEqual(sp_json['buydown'],str(buydown))





