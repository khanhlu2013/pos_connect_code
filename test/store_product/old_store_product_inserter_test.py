from django_webtest import WebTest
from store_product import insert_old_store_product_cm,insert_new_store_product_cm,insert_sku_cm
from store_product.models import Store_product
from store_product.couch import store_product_couch_getter
from model_mommy import mommy
from helper import test_helper
from product.couch import approve_product_document_getter


class old_store_product_inserter(WebTest):

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def can_insert_old_store_product_to_master_and_couch_test(self):
        #coverage run manage.py test --settings=settings.test test.store_product.old_store_product_inserter_test:old_store_product_inserter.can_insert_old_store_product_to_master_and_couch_test
        """
            .insert a new store_product to x_store
            .insert that same product to my_store, frequency = 2
            .verify my_store_product in master.store_product
            .verify my_store_product in couch.store_product
        """
        #.insert a new store_product to x_store
        x_user,x_store = test_helper.create_user_then_store()
        sku_str = '1234'
        x_store_product = insert_new_store_product_cm.exe(
             name = "x"
            ,price = None
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,business_id = x_store.id
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
             product = x_store_product.product
            ,business_id = my_store.id
            ,name = name
            ,price = price
            ,crv = crv
            ,isTaxable = isTaxable
            ,isTaxReport = isTaxReport
            ,isSaleReport = isSaleReport
            ,assoc_sku_str = sku_str
            ,frequency = 2)


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
        sku_lst = my_store_product_couch['sku_lst']
        self.assertEqual(len(sku_lst),1)
        self.assertTrue(sku_str in sku_lst)


    def can_detect_product_is_not_approve_after_assoc_and_not_insert_into_approve_product_test(self):
        #coverage run manage.py test --settings=settings.test test.store_product.old_store_product_inserter_test:old_store_product_inserter.can_detect_product_is_not_approve_after_assoc_and_not_insert_into_approve_product_test
        """
            .insert a new store_product to x_store
            .insert that same product to my_store, use ovrride default approve_frequency = 3
            .verify product not in couch.product
        """
        #.insert a new store_product to x_store
        x_user,x_store = test_helper.create_user_then_store()
        sku_str = '1234'
        frequency = 3
        x_store_product = insert_new_store_product_cm.exe(
             name = "x"
            ,price = None
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,business_id = x_store.id
            ,sku_str = sku_str
        )
        
        #.insert that same product to my_store, use ovrride default approve_frequency = 3
        my_user,my_store = test_helper.create_user_then_store()

        insert_old_store_product_cm.exe (
             product = x_store_product.product
            ,business_id = my_store.id
            ,name = 'my product'
            ,price = None
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,assoc_sku_str = sku_str
            ,frequency=frequency)

        
        #.verify my_store_product not in couch.product
        product_couch = approve_product_document_getter.exe(x_store_product.product.id)
        self.assertTrue(product_couch==None)        

    def can_detect_product_is_become_approve_after_assoc_and_insert_into_approve_product_test(self):
        #coverage run manage.py test --settings=settings.test test.store_product.old_store_product_inserter_test:old_store_product_inserter.can_detect_product_is_become_approve_after_assoc_and_insert_into_approve_product_test
        """
            .insert a new store_product to x_store
            .insert that same product to my_store, use  approve_frequency = 2
            .verify product in couch.product
        """
        #.insert a new store_product to x_store
        x_user,x_store = test_helper.create_user_then_store()
        sku_str = '1234'
        frequency = 2
        x_store_product = insert_new_store_product_cm.exe(
             name = "x"
            ,price = None
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,business_id = x_store.id
            ,sku_str = sku_str
        )
        
        #.insert that same product to my_store, use ovrride default approve_frequency = 3
        my_user,my_store = test_helper.create_user_then_store()

        insert_old_store_product_cm.exe (
             product = x_store_product.product
            ,business_id = my_store.id
            ,name = 'my product'
            ,price = None
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,assoc_sku_str = sku_str
            ,frequency=frequency)

        
        #.verify my_store_product in couch.product
        product_couch = approve_product_document_getter.exe(x_store_product.product.id)
        self.assertTrue(product_couch!=None)   

    def can_insert_only_approve_sku_when_insert_new_approve_product_test(self):
        #coverage run manage.py test --settings=settings.test test.store_product.old_store_product_inserter_test:old_store_product_inserter.can_insert_only_approve_sku_when_insert_new_approve_product_test
        """
            .insert a new x_store_product to x_store, with sku_1
            .add sku_2 to x_store_product
            .insert that x_product to my_store, use  approve_frequency = 2 and sku_1
            .verify x_product in couch.product with sku_1
        """
        #.insert a new x_store_product to x_store, with sku_1
        x_user,x_store = test_helper.create_user_then_store()
        sku_1_str = '1234'
        sku_2_str = '9999'
        frequency = 2
        x_store_product = insert_new_store_product_cm.exe(
             name = "x"
            ,price = None
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,business_id = x_store.id
            ,sku_str = sku_1_str
        )
        
        #.add sku_2 to x_store_product
        insert_sku_cm.content_management(
             sku_2_str
            ,x_store_product.product
            ,x_store#creator
            ,x_store_product 
        )

        #.insert that x_product to my_store, use  approve_frequency = 2 and sku_1
        my_user,my_store = test_helper.create_user_then_store()

        insert_old_store_product_cm.exe (
             product = x_store_product.product
            ,business_id = my_store.id
            ,name = 'my product'
            ,price = None
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,assoc_sku_str = sku_1_str
            ,frequency=frequency)

        
        #.verify x_product in couch.product with sku_1
        product_couch = approve_product_document_getter.exe(x_store_product.product.id)
        self.assertTrue(product_couch!=None) 
        self.assertEqual(len(product_couch['sku_lst']),1) 
        self.assertEqual(product_couch['sku_lst'][0],sku_1_str) 


    def can_update_approve_product_with_new_approve_sku_test(self):
        #coverage run manage.py test --settings=settings.test test.store_product.old_store_product_inserter_test:old_store_product_inserter.can_update_approve_product_with_new_approve_sku_test
        """
            .insert a new x_store_product to x_store, with sku_1
            .add sku_2 to x_store_product
            .insert that x_product to y_store, use  approve_frequency = 2 and sku_1
            .insert that x_product to z_store, use  approve_frequency = 2 and sku_2: now sku2 become approve and this approve_product should be updated with this sku
            .verify x_product in couch.product with sku_1, and sku2
        """
        #.insert a new x_store_product to x_store, with sku_1
        x_user,x_store = test_helper.create_user_then_store()
        sku_1_str = '1234'
        sku_2_str = '9999'
        frequency = 2
        x_store_product = insert_new_store_product_cm.exe(
             name = "x"
            ,price = None
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,business_id = x_store.id
            ,sku_str = sku_1_str
        )
        
        #.add sku_2 to x_store_product
        insert_sku_cm.content_management(
             sku_2_str
            ,x_store_product.product
            ,x_store#creator
            ,x_store_product 
        )

        #.insert that x_product to y_store, use  approve_frequency = 2 and sku_1
        y_user,y_store = test_helper.create_user_then_store()
        insert_old_store_product_cm.exe (
             product = x_store_product.product
            ,business_id = y_store.id
            ,name = 'my product'
            ,price = None
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,assoc_sku_str = sku_1_str
            ,frequency=frequency)

        #.insert that x_product to z_store, use approve_frequency = 2 and sku_2: now sku2 become approve and this approve_product should be updated with this sku
        z_user,z_store = test_helper.create_user_then_store()
        insert_old_store_product_cm.exe (
             product = x_store_product.product
            ,business_id = z_store.id
            ,name = 'my product'
            ,price = None
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,assoc_sku_str = sku_2_str
            ,frequency=frequency)

        #.verify x_product in couch.product with sku_1
        product_couch = approve_product_document_getter.exe(x_store_product.product.id)
        self.assertTrue(product_couch!=None) 
        self.assertEqual(len(product_couch['sku_lst']),2) 
        self.assertTrue(sku_1_str in product_couch['sku_lst'])
        self.assertTrue(sku_2_str in product_couch['sku_lst'])



