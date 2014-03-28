from django_webtest import WebTest
from model_mommy import mommy
from django.core.urlresolvers import reverse
from product.models import Product,ProdSkuAssoc,Sku
from store_product.models import Store_product
from helper import test_helper
from store_product.couch import store_product_couch_getter
from django.conf import settings
from store_product import insert_new_store_product_cm
from decimal import Decimal

class Test(WebTest):

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        #foreman  run -e .env,test.env python manage.py test store_product.tests.test_update_prod_bus_assoc:Test.test
        
        #FIXTURE
        user,bus = test_helper.create_user_then_store();
        prod_bus_assoc = insert_new_store_product_cm.exe(\
             business_id = bus.id            
            ,name = 'Jack Daniel'
            ,price = 2.99
            ,crv = None
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,sku_str = None )

        #MAKING REQUEST
        res = self.app.get(
            reverse('store_product:update_product',kwargs={'pk':prod_bus_assoc.id}),
            user = user )
        self.assertEqual(res.status_int,200)
        
        #FILL OUT AND SUBMIT FORM
        new_name = 'Fireball'
        new_price = Decimal('3.99')
        new_crv = Decimal('1.23')
        form = res.form
        new_is_taxable = False
        new_is_tax_report = False
        new_is_sale_report = False
        new_p_type = 'a'
        new_p_tag = 'b'

        form['name'] = new_name
        form['price'] = new_price
        form['crv'] = new_crv
        form['isTaxable'] = new_is_taxable
        form['isTaxReport'] = new_is_tax_report
        form['isSaleReport'] = new_is_sale_report
        form['p_type'] = new_p_type
        form['p_tag'] = new_p_tag

        res = form.submit().follow()
        self.assertEqual(res.status_int,200)
        
        #VALIDATE RELATIONAL DB
        sp = Store_product.objects.get(pk=prod_bus_assoc.id)
        self.assertEqual(sp.name,new_name)
        self.assertEqual(sp.price,new_price)
        self.assertEqual(sp.crv,new_crv)

        self.assertEqual(sp.isTaxable,new_is_taxable)
        self.assertEqual(sp.isTaxReport,new_is_tax_report)
        self.assertEqual(sp.isSaleReport,new_is_sale_report)
        self.assertEqual(sp.p_type,new_p_type)
        self.assertEqual(sp.p_tag,new_p_tag)

        #VALIDATE COUCH DB
        couch_prod_bus_assoc = store_product_couch_getter.exe(sp.product.id,sp.business.id)
        self.assertEqual(couch_prod_bus_assoc['name'],new_name)
        self.assertEqual(couch_prod_bus_assoc['price'],str(new_price))
        self.assertEqual(couch_prod_bus_assoc['crv'],str(new_crv))

