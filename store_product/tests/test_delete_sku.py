from django_webtest import WebTest
from django.core.urlresolvers import reverse
from model_mommy import mommy
from store_product.couch import store_product_couch_getter
from store_product import insert_new_store_product_cm
from product.models import ProdSkuAssoc
from helper import test_helper

class Test(WebTest):   
    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        # xxx test failed
        #foreman  run -e .env,test.env python manage.py test store_product.tests.test_delete_sku:Test.test         

        #FIXTURE
        #CREATE A PRODUCT FOR THIS STORE
        user_this,store_this = test_helper.create_user_then_store()
        sku_str = '123'
        product_name = "Jack Daniel"
        price = 2.99
        prod_bus_assoc_this = insert_new_store_product_cm.exe( \
             name = product_name
            ,price = price
            ,crv = None
            ,isTaxable = True
            ,isTaxReport = True
            ,isSaleReport = True
            ,business_id = store_this.id
            ,sku_str = sku_str )

        #TEST RELATIONAL
        rel_prod_sku_assoc_lst = prod_bus_assoc_this.product.prodskuassoc_set.all()
        self.assertEqual(len(rel_prod_sku_assoc_lst),1)
        rel_prod_sku_assoc = rel_prod_sku_assoc_lst[0]
        self.assertEqual(prod_bus_assoc_this.product,rel_prod_sku_assoc.product)
        self.assertEqual(prod_bus_assoc_this.business,store_this)

        #TEST COUCHDB
        couch_prod_bus_assoc = store_product_couch_getter.exe(prod_bus_assoc_this.product.id,prod_bus_assoc_this.business.id)  
        couch_sku_lst = couch_prod_bus_assoc['sku_lst']
        self.assertEqual(len(couch_sku_lst),1)

        #MAKE REQUEST
        res = self.app.get(
            reverse(
                'store_product:delete_sku',
                kwargs={'pk':rel_prod_sku_assoc.id}
            ),
            user=user_this)
        self.assertEqual(res.status_int,200)
        
        #SUBMIT FORM
        form = res.form
        res = form.submit().follow()
        self.assertEqual(res.status_int,200)

        #TEST RELATIONAL DB
        try:
            ProdSkuAssoc.objects.get(sku__sku=sku_str)
            self.assertFalse('sku should no longer exist')
        except ProdSkuAssoc.DoesNotExist:
            pass #sku is deleted

        #TEST COUCH DB
        couch_prod_bus_assoc = store_product_couch_getter.exe(prod_bus_assoc_this.product.id,prod_bus_assoc_this.business.id)  
        couch_sku_lst = couch_prod_bus_assoc['sku_lst']
        self.assertEqual(len(couch_sku_lst),0)#delete

