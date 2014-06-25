from django_webtest import WebTest
from store_product import new_sp_inserter
from store_product.models import Store_product
from store_product.sp_couch import store_product_couch_getter
from model_mommy import mommy
from helper import test_helper
from decimal import Decimal

class test(WebTest):

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        #foreman  run -e .env,test.env python manage.py test test.store_product.new_sp_test:test.test
        """
            .insert a new store_product to store
            .verify sp in master.store_product
            .verify sp in couch.store_product
            .verify sp not in couch.product
        """
        #.insert a new store_product to store
        user,store = test_helper.create_user_then_store()
        
        name = 'my product name'
        price = 1.1
        crv = 1.2
        is_taxable = True
        is_sale_report = True
        p_type = 'type'
        p_tag = 'tag'
        sku_str = '1234'
        cost = 1.3
        vendor = 'pitco'
        buydown = 1.4

        sp = new_sp_inserter.exe(
             store_id = store.id            
            ,name = name
            ,price = price
            ,value_customer_price = None
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
        
        #.verify sp in master.store_product
        sp = Store_product.objects.get(product_id=sp.product.id,store_id=store.id)
        self.assertTrue(sp!=None)
        self.assertEqual(sp.name,name)
        self.assertEqual(sp.price,Decimal(str(price)))
        self.assertEqual(sp.crv,Decimal(str(crv)))
        self.assertEqual(sp.is_taxable,is_taxable)
        self.assertEqual(sp.is_sale_report,is_sale_report)
        self.assertEqual(sp.p_type,p_type)
        self.assertEqual(sp.p_tag,p_tag)        
        self.assertEqual(len(sp.product.sku_set.all()),1)
        self.assertEqual(sp.product.sku_set.all()[0].sku,sku_str)
        self.assertEqual(sp.cost,Decimal(str(cost)))
        self.assertEqual(sp.vendor,vendor)  
        self.assertEqual(sp.buydown,Decimal(str(buydown)))

        #.verify sp in couch.store_product
        sp_couch = store_product_couch_getter.exe(sp.product.id,store.id)
        self.assertTrue(sp_couch!=None)
        self.assertEqual(sp_couch['name'],name)
        self.assertEqual(sp_couch['price'],str(price))
        self.assertEqual(sp_couch['crv'],str(crv))
        self.assertEqual(sp_couch['is_taxable'],is_taxable)
        self.assertEqual(sp_couch['is_sale_report'],is_sale_report)
        self.assertEqual(sp_couch['p_type'],p_type)
        self.assertEqual(sp_couch['p_tag'],p_tag)        
        self.assertEqual(sp_couch['store_id'],store.id )
        sku_lst = sp_couch['sku_lst']
        self.assertEqual(len(sku_lst),1)
        self.assertTrue(sku_str in sku_lst)
        self.assertEqual(sp_couch['cost'],str(cost))
        self.assertEqual(sp_couch['vendor'],vendor)  
        self.assertEqual(sp_couch['buydown'],str(buydown))  
        