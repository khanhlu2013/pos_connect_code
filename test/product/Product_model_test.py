from django_webtest import WebTest
from model_mommy import mommy
from store_product import insert_old_store_product_cm
from helper import test_helper

class Product(WebTest):
    
    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def override_false_dynamic_false_test(self):
        # foreman  run -e .env,test.env python manage.py test test.product.Product_model_test:Product.override_false_dynamic_false_test
        #override -> false
        sku_str = '123'
        product = test_helper.createProductWithSku(sku_str=sku_str,is_approve_override=False)
        
        #dynamic -> false
        user_x,store_x = test_helper.create_user_then_store()
        frequency = 2
        insert_old_store_product_cm.exe(
             product_id = product.id
            ,business_id = store_x.id
            ,name = "name 1"
            ,price = None
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,assoc_sku_str = sku_str )

        #assert
        self.assertFalse(product.is_approve(frequency))

    def override_false_dynamic_true_test(self):
        # foreman  run -e .env,test.env python manage.py test test.product.Product_model_test:Product.override_false_dynamic_true_test       
        #override -> false
        sku_str = '123'
        product = test_helper.createProductWithSku(sku_str=sku_str,is_approve_override=False)

        #dynamic -> false
        user_x,store_x = test_helper.create_user_then_store()
        user_y,store_y = test_helper.create_user_then_store()
        frequency = 2
        insert_old_store_product_cm.exe(
             product_id = product.id
            ,business_id = store_x.id
            ,name = "name 1"
            ,price = None
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,assoc_sku_str = sku_str )

        insert_old_store_product_cm.exe(
             product_id = product.id
            ,business_id = store_y.id
            ,name = "name 1"
            ,price = None
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,assoc_sku_str = sku_str )

        #assert
        self.assertTrue(product.is_approve(frequency))


    def override_true_dynamic_false_test(self):
        # foreman  run -e .env,test.env python manage.py test test.product.Product_model_test:Product.override_true_dynamic_false_test
        #override -> true
        sku_str = '123'
        product = test_helper.createProductWithSku(sku_str=sku_str,is_approve_override=True)
        
        #dynamic -> false
        user_x,store_x = test_helper.create_user_then_store()
        frequency = 2
        insert_old_store_product_cm.exe(
             product_id = product.id
            ,business_id = store_x.id
            ,name = "name 1"
            ,price = None
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,assoc_sku_str = sku_str )

        #assert
        self.assertTrue(product.is_approve(frequency))


    def override_true_dynamic_true_test(self):
        # foreman  run -e .env,test.env python manage.py test test.product.Product_model_test:Product.override_true_dynamic_true_test
        #override -> true
        sku_str = '123'
        product = test_helper.createProductWithSku(sku_str=sku_str,is_approve_override=True)
        
        #dynamic -> true
        user_x,store_x = test_helper.create_user_then_store()
        user_y,store_y = test_helper.create_user_then_store()
        frequency = 2
        insert_old_store_product_cm.exe(
             product_id = product.id
            ,business_id = store_x.id
            ,name = "name 1"
            ,price = None
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,assoc_sku_str = sku_str )
        
        insert_old_store_product_cm.exe(
             product_id = product.id
            ,business_id = store_y.id
            ,name = "name 1"
            ,price = None
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,assoc_sku_str = sku_str )

        #assert
        self.assertTrue(product.is_approve(frequency))



