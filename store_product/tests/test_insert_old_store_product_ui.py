from django_webtest import WebTest
from django.core.urlresolvers import reverse
from decimal import Decimal
from model_mommy import mommy
from store_product import insert_new_store_product_cm
from product.models import Product,ProdSkuAssoc,Sku
from store_product.models import Store_product
from helper import test_helper
from store_product.couch import store_product_couch_getter


class Test(WebTest):    
    def test(self):
        #coverage run manage.py test --settings=settings.test store_product.tests.test_insert_old_store_product_ui:Test.test
        #SETUP COUCHDB
        test_helper.setup_test_couchdb()

        #CREATE PROD_BUS_ASSOC_OTHER
        sku_str_other = '12345'
        user_other,bus_other = test_helper.create_user_then_store();
        prod_bus_assoc_other = insert_new_store_product_cm.exe( \
             name = "Jack Daniel"
            ,price = 2.99
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,business_id = bus_other.id
            ,sku_str = sku_str_other)

        #ALSO ASSUME THAT CREATED PRODUCT HAS ANOTHER COUPLE APPROVED SKU
        approved_sku_1_str = '9999'
        approved_sku_1 = mommy.make(Sku,sku=approved_sku_1_str,is_approved=True)
        mommy.make(ProdSkuAssoc,product=prod_bus_assoc_other.product,sku=approved_sku_1,is_approve_override = True)

        approved_sku_2_str = '8888'
        approved_sku_2 = mommy.make(Sku,sku=approved_sku_2_str,is_approved=True)
        mommy.make(ProdSkuAssoc,product=prod_bus_assoc_other.product,sku=approved_sku_2,is_approve_override = True)

        #CREATE THIS STORE
        user_this,bus_this = test_helper.create_user_then_store();
        
        #MAKING REQUEST FROM THIS STORE TO ADD OTHER PRODUCT
        res = self.app.get(
            reverse
            (
                'store_product:add_assoc',
                kwargs={'product_id':prod_bus_assoc_other.product.id,'sku_str':sku_str_other}
            ),
            user = user_this)
        self.assertEqual(res.status_int,200)
        
        #FILL OUT AND SUBMIT FORM
        product_name_this = 'My Jack Daniel'
        price_this = 3.45
        form = res.form
        form['name'] = product_name_this
        form['price'] = price_this
        res = form.submit().follow()
        self.assertEqual(res.status_int,200)
        
        #VALIDATE THIS STORE PRODUCT - RELATIONAL
        prod_bus_assoc_rel_this = Store_product.objects.get(product__id=prod_bus_assoc_other.id,business__id=bus_this.id)
        self.assertEqual(prod_bus_assoc_rel_this.name,product_name_this)
        self.assertEqual(prod_bus_assoc_rel_this.price,Decimal(str(price_this)))
        
        #VALIDATE THIS STORE PRODUCT - COUCHDB
        prod_bus_assoc_couch_this = store_product_couch_getter.exe(prod_bus_assoc_rel_this.product.id,prod_bus_assoc_rel_this.business.id)
        self.assertEqual(prod_bus_assoc_couch_this['name'],product_name_this)
        self.assertEqual(prod_bus_assoc_couch_this['price'],str(price_this))
        sku_lst = prod_bus_assoc_couch_this['sku_lst']
        self.assertEqual(len(sku_lst),3)
        self.assertTrue(approved_sku_1_str in sku_lst)
        self.assertTrue(approved_sku_2_str in sku_lst)
        self.assertTrue(sku_str_other in sku_lst)

        test_helper.teardown_test_couchdb()
