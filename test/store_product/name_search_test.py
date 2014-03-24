from django_webtest import WebTest
from model_mommy import mommy
from django.core.urlresolvers import reverse
from helper import test_helper
from product.models import Product

class test(WebTest):

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        # foreman  run -e .env,test.env python manage.py test test.store_product.name_search_test:test.test

        #FIXTURE---------------------------------------------
        #user and store
        user,store = test_helper.create_user_then_store()
        #create product
        product = mommy.make('product.Product')
        #associcate product and business
        store_product = test_helper.associateProductAndBusiness(product=product,business=store)
        #override name for this store
        name = 'xyz product'
        store_product.name = name
        store_product.save()


        #MAKING REQUEST---------------------------------------
        res = self.app.get(
            reverse('store_product:search_product'),
            user = user #authentication
        )
        self.assertEqual(res.status_int,200)

        #NAME SEARCH------------------------------------------
        name_form = res.forms['name']
        name_form['name'] = 'xyz'
        res = name_form.submit()
        self.assertEqual(res.status_int,200)

        #PRODUCT RESULT EXIST---------------------------------
        product_lst = res.context['product_lst']
        self.assertEqual(len(product_lst),1)

        #PRODUCT BELONG TO THE STORE--------------------------
        product = product_lst[0]
        self.assertEqual(product.bus_lst.all()[0],store) 

        