from decimal import Decimal
from django_webtest import WebTest
from django.core.urlresolvers import reverse
from model_mommy import mommy
from helper import test_helper
from product.models import Product
from store_product.couch import store_product_couch_getter
from util.couch import couch_util
from store_product.models import Store_product

class Test(WebTest):
    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        #foreman  run -e .env,test.env python manage.py test store_product.tests.test_insert_new_store_product:Test.test

        #-FIXTURE
        #user and store
        user,bus = test_helper.create_user_then_store()
        sku_str = '123'
        



        #-MAKING REQUEST
        res = self.app.\
        get(
            reverse('store_product:add_product_sku',kwargs={'pre_fill_sku':sku_str}),
            user = user#authenticate
        )
        self.assertEqual(res.status_int,200)




        #-FILL OUT AND SUBMIT FORM
        name = 'Jack Daniel'
        price = 2.99
        form = res.form
        is_taxable = True
        crv = 12.3
        p_type = 'a'
        p_tag = 'b'

        form['name'] = name
        form['price'] = price
        form['crv'] = crv
        form['isTaxable'] = is_taxable
        form['p_type'] = p_type
        form['p_tag'] = p_tag
        res = form.submit()
        


      
        #-ASSERT STORE PRODUCT ON MASTER
        sp = None
        sp_lst = list(Store_product.objects.all())
        self.assertEqual(len(sp_lst),1)
        sp = sp_lst[0]
        self.assertEqual(sp.name,name)
        self.assertEqual(sp.price,Decimal(str(price)))
        self.assertEqual(sp.isTaxable,is_taxable)
        self.assertEqual(sp.crv,Decimal(str(crv)))
        self.assertEqual(sp.p_type,p_type)
        self.assertEqual(sp.p_tag,p_tag)

        #ASSERT SKU / PROD_SKU_ASSOC
        all_prod_sku_assoc = sp.product.prodskuassoc_set.all()
        self.assertEqual(len(all_prod_sku_assoc),1)
        prod_sku_assoc = all_prod_sku_assoc[0]
        self.assertEqual(prod_sku_assoc.sku.sku,sku_str)
        
        #ASSERT prod_sku_assoc__prod_bus_assoc
        store_product2 = prod_sku_assoc.store_product_lst.all()[0]
        self.assertEqual(sp,store_product2)
        



        #-ASSERT STORE PRODUCT ON COUCH
        document = store_product_couch_getter.exe(sp.product.id,sp.business.id)
        self.assertEqual(document['name'],name)
        self.assertEqual(document['price'],str(price))
        self.assertEqual(document['crv'],str(crv))
        self.assertEqual(document['is_taxable'],is_taxable)
        self.assertEqual(len(document['sku_lst']),1)
        self.assertEqual(document['sku_lst'][0],sku_str)

