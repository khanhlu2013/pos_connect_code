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

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        #foreman  run -e .env,test.env python manage.py test store_product.tests.test_insert_old_store_product_ui:Test.test

        #CREATE PROD_BUS_ASSOC_OTHER
        sku_str_other = '12345'
        user_other,bus_other = test_helper.create_user_then_store();
        prod_bus_assoc_other = insert_new_store_product_cm.exe( \
             business_id = bus_other.id            
            ,name = "Jack Daniel"
            ,price = 2.99
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,sku_str = sku_str_other)

        #ALSO ASSUME THAT CREATED PRODUCT HAS ANOTHER COUPLE APPROVED SKU
        approved_sku_1_str = '9999'
        approved_sku_1 = mommy.make(Sku,sku=approved_sku_1_str,is_approved=True)
        mommy.make(ProdSkuAssoc,product=prod_bus_assoc_other.product,sku=approved_sku_1,is_approve_override = True)

        approved_sku_2_str = '8888'
        approved_sku_2 = mommy.make(Sku,sku=approved_sku_2_str,is_approved=True)
        mommy.make(ProdSkuAssoc,product=prod_bus_assoc_other.product,sku=approved_sku_2,is_approve_override = True)

        #CREATE THIS STORE
        my_user,my_bus = test_helper.create_user_then_store();
        
        #MAKING REQUEST FROM THIS STORE TO ADD OTHER PRODUCT
        res = self.app.get(
            reverse
            (
                'store_product:add_assoc',
                kwargs={'product_id':prod_bus_assoc_other.product.id,'sku_str':sku_str_other}
            ),
            user = my_user)
        self.assertEqual(res.status_int,200)
        
        #FILL OUT AND SUBMIT FORM
        my_name = 'My Jack Daniel'
        my_price = 3.45
        my_crv = 1.2
        my_is_taxable = True
        my_is_sale_report = False
        my_is_tax_report = False

        form = res.form
        form['name'] = my_name
        form['price'] = my_price
        form['crv'] = my_crv
        form['isTaxable'] = my_is_taxable
        form['isTaxReport'] = my_is_tax_report
        form['isSaleReport'] = my_is_sale_report
        res = form.submit().follow()
        self.assertEqual(res.status_int,200)
        
        #VALIDATE THIS STORE PRODUCT - RELATIONAL
        my_sp = Store_product.objects.get(product__id=prod_bus_assoc_other.id,business__id=my_bus.id)
        self.assertEqual(my_sp.name,my_name)
        self.assertEqual(my_sp.price,Decimal(str(my_price)))
        self.assertEqual(my_sp.crv,Decimal(str(my_crv)))

        self.assertEqual(my_sp.isTaxable,my_is_taxable)
        self.assertEqual(my_sp.isTaxReport,my_is_tax_report)
        self.assertEqual(my_sp.isSaleReport,my_is_sale_report)                        


        #VALIDATE THIS STORE PRODUCT - COUCHDB
        my_sp_couch = store_product_couch_getter.exe(my_sp.product.id,my_sp.business.id)
        self.assertEqual(my_sp_couch['name'],my_name)
        self.assertEqual(my_sp_couch['price'],str(my_price))
        sku_lst = my_sp_couch['sku_lst']
        self.assertEqual(len(sku_lst),3)
        self.assertTrue(approved_sku_1_str in sku_lst)
        self.assertTrue(approved_sku_2_str in sku_lst)
        self.assertTrue(sku_str_other in sku_lst)

