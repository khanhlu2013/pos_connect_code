from django_webtest import WebTest
from model_mommy import mommy
from django.core.urlresolvers import reverse
from product.models import Product,ProdSkuAssoc,Category,Department,Sku
from store_product.models import Store_product
from helper import test_helper
from store_product.couch import store_product_couch_getter
from django.conf import settings
from store_product import insert_new_store_product_cm
from decimal import Decimal

class Test(WebTest):
    def test(self):
        #coverage run manage.py test --settings=settings.test store_product.tests.test_update_prod_bus_assoc:Test.test
        #SETUP COUCHDB TEST DB
        test_helper.setup_test_couchdb()
        
        #FIXTURE
        user,bus = test_helper.create_user_then_store();
        old_cateogry,old_department = test_helper.create_category_then_department(bus,cat_name='cat',dep_name='dep')
        new_category,new_department = test_helper.create_category_then_department(bus,cat_name='new_cat',dep_name='new_dep')
        prod_bus_assoc = insert_new_store_product_cm.exe(\
             name = 'Jack Daniel'
            ,price = 2.99
            ,crv = None
            ,department = old_department
            ,isTaxable = False
            ,isTaxReport = False
            ,isSaleReport = False
            ,business_id = bus.id
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
        form['name'] = new_name
        form['price'] = new_price
        form['crv'] = new_crv
        form['department'] = new_department.id
        res = form.submit().follow()
        self.assertEqual(res.status_int,200)
        
        #VALIDATE RELATIONAL DB
        rel_prod_bus_assoc = Store_product.objects.get(pk=prod_bus_assoc.id)
        self.assertEqual(rel_prod_bus_assoc.name,new_name)
        self.assertEqual(rel_prod_bus_assoc.price,new_price)
        self.assertEqual(rel_prod_bus_assoc.crv,new_crv)
        self.assertEqual(rel_prod_bus_assoc.department,new_department)

        #VALIDATE COUCH DB
        couch_prod_bus_assoc = store_product_couch_getter.exe(rel_prod_bus_assoc.product.id,rel_prod_bus_assoc.business.id)
        self.assertEqual(couch_prod_bus_assoc['name'],new_name)
        self.assertEqual(couch_prod_bus_assoc['price'],str(new_price))
        self.assertEqual(couch_prod_bus_assoc['crv'],str(new_crv))

        #CLEAN UP COUCHDB TEST DB
        test_helper.teardown_test_couchdb()
