from django_webtest import WebTest
from django.core.urlresolvers import reverse
from helper import test_helper
from product.models import ProdSkuAssoc
from store_product.couch import store_product_couch_getter
from store_product.models import Store_product
from store_product import insert_new_store_product_cm

class Test(WebTest):
    def test_add_sku_skuExistForSameProduct(self):
        #coverage run manage.py test --settings=settings.test store_product.tests.test_insert_sku_specialCase:Test.test_add_sku_skuExistForSameProduct
        #SETUP COUCHDB
        test_helper.setup_test_couchdb()

        #FIXTURE
        user,store = test_helper.create_user_then_store()
        sku_str = '123'
        prod_bus_assoc = insert_new_store_product_cm.exe( \
             name = 'Jack Daniel'
            ,price = 2.99
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,business_id = store.id
            ,sku_str = sku_str)

        #MAKE REQUEST
        res = self.app.get(reverse('store_product:add_sku',kwargs={'prod_bus_assoc_id':prod_bus_assoc.id}),user=user)
        self.assertEqual(res.status_int,200)

        #TEST SKU LIST CONTAIN 1 RESULT
        sku_lst = res.context['prodskuassoc_lst']
        self.assertEqual(res.status_int,200)
        self.assertEqual(len(sku_lst),1)

        #ADD SKU
        form = res.form
        form['sku_field'] = sku_str
        res = form.submit()#notice we did not follow here since the form will contain error
        self.assertEqual(res.status_int,200)
        sku_lst = res.context['prodskuassoc_lst']
        self.assertEqual(len(sku_lst),1)#still 1 sku associate with this product. Duplicated sku is not added
        self.assertTrue('sku existed for this product' in res.text)

        #CLEAN UP COUCHDB
        test_helper.teardown_test_couchdb()

    def test_add_sku_skuExistForDifferentProduct(self):
        #coverage run manage.py test --settings=settings.test store_product.tests.test_insert_sku_specialCase:Test.test_add_sku_skuExistForDifferentProduct
        
        #SETUP COUCHDB
        test_helper.setup_test_couchdb()

        #INSERT PRODUCT TO OTHER STORE, WITH OTHER_SKU
        user_other,store_other = test_helper.create_user_then_store()
        sku_other_str = '123'
        prod_bus_assoc_other = insert_new_store_product_cm.exe( \
             name = 'Jack Daniel'
            ,price = 2.99
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,business_id = store_other.id
            ,sku_str = sku_other_str)

        #INSERT PRODUCT TO THIS STORE
        user_this,store_this = test_helper.create_user_then_store()
        sku_this_str = '321'
        prod_bus_assoc_this = insert_new_store_product_cm.exe( \
             name = 'Jack Daniel'
            ,price = 2.99
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,business_id = store_this.id
            ,sku_str = sku_this_str)

        #MAKE REQUEST
        res = self.app.get(reverse('store_product:add_sku',kwargs={'prod_bus_assoc_id':prod_bus_assoc_this.id}),user=user_this)
        self.assertEqual(res.status_int,200)
        
        #TEST SKU LIST CONTAIN 1 RESULT
        sku_lst = res.context['prodskuassoc_lst']
        self.assertEqual(len(sku_lst),1)

        #FILL OUT FORM - ADD SAME SKU FOR OTHER PRODUCT TO THIS PRODUCT
        form = res.form
        form['sku_field'] = sku_other_str
        res = form.submit().follow()
        self.assertEqual(res.status_int,200)
        sku_lst = res.context['prodskuassoc_lst']
        self.assertEqual(len(sku_lst),2)#sku is added eventhough it is exist for another product

        #TEST RELATIONAL DB - THIS STORE
        rel_prod_bus_assoc = Store_product.objects.get(pk=prod_bus_assoc_this.id)
        prod_sku_assoc = ProdSkuAssoc.objects.get(product__id = rel_prod_bus_assoc.product.id,sku__sku = sku_other_str)
        self.assertTrue(prod_sku_assoc!=None)

        #TEST COUCH DB - THIS STORE
        couch_prod_bus_assoc = store_product_couch_getter.exe(rel_prod_bus_assoc.product.id,rel_prod_bus_assoc.business.id)
        couch_sku_lst = couch_prod_bus_assoc['sku_lst']
        self.assertEqual(len(couch_sku_lst),2)
        self.assertTrue(sku_other_str in couch_sku_lst)
        self.assertTrue(sku_this_str in couch_sku_lst)

        #CLEAN UP COUCHDB
        test_helper.teardown_test_couchdb()
    


