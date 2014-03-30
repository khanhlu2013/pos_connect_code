from django_webtest import WebTest
from store_product import insert_old_store_product_cm,insert_new_store_product_cm,insert_sku_cm
from store_product.models import Store_product
from store_product.couch import store_product_couch_getter
from model_mommy import mommy
from helper import test_helper

class old_store_product_inserter(WebTest):

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def can_insert_old_store_product_to_master_and_couch_test(self):
        #foreman  run -e .env,test.env python manage.py test test.store_product.old_store_product_inserter_test:old_store_product_inserter.can_insert_old_store_product_to_master_and_couch_test
        """
            .insert a new store_product to x_store
            .insert that same product to my_store
            .verify my_store_product in master.store_product
            .verify my_store_product in couch.store_product
        """
        #.insert a new store_product to x_store
        x_user,x_store = test_helper.create_user_then_store()
        sku_str = '1234'
        x_store_product = insert_new_store_product_cm.exe(
             business_id = x_store.id            
            ,name = "x"
            ,price = None
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,sku_str = sku_str
        )
        
        #.insert that same product to my_store, use default approve_frequency = 2
        my_user,my_store = test_helper.create_user_then_store()
        name = 'my product name'
        price = 1
        crv = 1
        isTaxable = True
        isTaxReport = True
        isSaleReport = True

        insert_old_store_product_cm.exe (
             product_id = x_store_product.product.id
            ,business_id = my_store.id
            ,name = name
            ,price = price
            ,crv = crv
            ,isTaxable = isTaxable
            ,isTaxReport = isTaxReport
            ,isSaleReport = isSaleReport
            ,assoc_sku_str = sku_str
        )


        #.verify my_store_product in master.store_product
        my_store_product = Store_product.objects.get(product__id=x_store_product.product.id,business__id=my_store.id)
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
        my_store_product_couch = store_product_couch_getter.exe(x_store_product.product.id,my_store.id)
        self.assertTrue(my_store_product_couch!=None)
        self.assertEqual(my_store_product_couch['name'],name)
        self.assertEqual(my_store_product_couch['price'],str(price))
        self.assertEqual(my_store_product_couch['crv'],str(crv))
        self.assertEqual(my_store_product_couch['is_taxable'],isTaxable)
        self.assertEqual(my_store_product_couch['store_id'],my_store.id )
        sku_lst = my_store_product_couch['sku_lst']
        self.assertEqual(len(sku_lst),1)
        self.assertTrue(sku_str in sku_lst)




