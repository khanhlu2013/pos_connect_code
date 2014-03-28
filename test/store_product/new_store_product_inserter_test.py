from django_webtest import WebTest
from store_product import insert_new_store_product_cm
from store_product.models import Store_product
from store_product.couch import store_product_couch_getter
from model_mommy import mommy
from helper import test_helper

class new_store_product_inserter(WebTest):

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def can_insert_new_store_product_test(self):
        #foreman  run -e .env,test.env python manage.py test test.store_product.new_store_product_inserter_test:new_store_product_inserter.can_insert_new_store_product_test
        """
            .insert a new store_product to my_store
            .verify my_store_product in master.store_product
            .verify my_store_product in couch.store_product
            .verify my_store_product not in couch.product
        """
        #.insert a new store_product to my_store
        my_user,my_store = test_helper.create_user_then_store()
        name = 'my product name'
        price = 1
        crv = 1
        isTaxable = True
        isTaxReport = True
        isSaleReport = True
        sku_str = '1234'
        my_store_product = insert_new_store_product_cm.exe(
             business_id = my_store.id            
            ,name = name
            ,price = price
            ,crv = crv
            ,isTaxable = isTaxable
            ,isTaxReport = isTaxReport
            ,isSaleReport = isSaleReport
            ,sku_str = sku_str
        )
        
        #.verify my_store_product in master.store_product
        my_store_product = Store_product.objects.get(product__id=my_store_product.product.id,business__id=my_store.id)
        self.assertTrue(my_store_product!=None)
        self.assertEqual(my_store_product.name,name)
        self.assertEqual(my_store_product.price,price)
        self.assertEqual(my_store_product.crv,crv)
        self.assertEqual(my_store_product.isTaxReport,isTaxable)
        self.assertEqual(my_store_product.isTaxReport,isTaxReport)
        self.assertEqual(my_store_product.isSaleReport,isSaleReport)
        self.assertEqual(len(my_store_product.product.sku_lst.all()),1)
        self.assertEqual(my_store_product.product.sku_lst.all()[0].sku,sku_str)

        #.verify my_store_product in couch.store_product
        my_store_product_couch = store_product_couch_getter.exe(my_store_product.product.id,my_store.id)
        self.assertTrue(my_store_product_couch!=None)
        self.assertEqual(my_store_product_couch['name'],name)
        self.assertEqual(my_store_product_couch['price'],str(price))
        self.assertEqual(my_store_product_couch['crv'],str(crv))
        self.assertEqual(my_store_product_couch['is_taxable'],isTaxable)
        sku_lst = my_store_product_couch['sku_lst']
        self.assertEqual(len(sku_lst),1)
        self.assertTrue(sku_str in sku_lst)

        