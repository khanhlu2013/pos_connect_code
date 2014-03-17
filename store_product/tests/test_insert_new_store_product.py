from decimal import Decimal
from django_webtest import WebTest
from django.core.urlresolvers import reverse
from model_mommy import mommy
from helper import test_helper
from product.models import Product
from store_product.couch import store_product_couch_getter
from util.couch import couch_util

class Test(WebTest):
    def test(self):
        #coverage run manage.py test --settings=settings.test store_product.tests.test_insert_new_store_product:Test.test
        #SETUP COUCHDB-----------------------------------------------------
        test_helper.setup_test_couchdb()

        #FIXTURE-----------------------------------------------------------
        #user and store
        user,bus = test_helper.create_user_then_store()
        sku_str = '123'
        
        #MAKING REQUEST----------------------------------------------------
        res = self.app.\
        get(
            reverse('store_product:add_product_sku',kwargs={'pre_fill_sku':sku_str}),
            user = user#authenticate
        )
        self.assertEqual(res.status_int,200)

        #FILL OUT AND SUBMIT FORM------------------------------------------
        name = 'Jack Daniel'
        price = 2.99
        form = res.form
        is_taxable = True
        crv = 12.3
        form['name'] = name
        form['price'] = price
        form['crv'] = crv
        form['isTaxable'] = is_taxable
        res = form.submit()
        
        #VALIDATE DATA OF RELATIONAL DB------------------------------------
        prods = Product.objects.all()
        self.assertEqual(len(prods),1)
        prod = prods[0]
        
        #ASSERT PROD_BUS_ASSOC
        store_product = prod.get_store_product(bus)
        self.assertEqual(store_product.business,bus)
        
        #ASSERT SKU / PROD_SKU_ASSOC
        all_prod_sku_assoc = prod.prodskuassoc_set.all()
        self.assertEqual(len(all_prod_sku_assoc),1)
        prod_sku_assoc = all_prod_sku_assoc[0]
        self.assertEqual(prod_sku_assoc.sku.sku,sku_str)
        
        #ASSERT prod_sku_assoc__prod_bus_assoc
        store_product2 = prod_sku_assoc.store_product_lst.all()[0]
        self.assertEqual(store_product,store_product2)
        
        #VALIDATE DATA OF COUCH DB-----------------------------------------
        document = store_product_couch_getter.exe(store_product.product.id,store_product.business.id)
        self.assertEqual(document['name'],name)
        self.assertEqual(document['price'],str(price))
        self.assertEqual(document['crv'],str(crv))
        self.assertEqual(document['is_taxable'],is_taxable)
        self.assertEqual(len(document['sku_lst']),1)
        self.assertEqual(document['sku_lst'][0],sku_str)

        #TEARDOWN COUCHDB TEST
        test_helper.teardown_test_couchdb()