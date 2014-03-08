from django_webtest import WebTest 
from model_mommy import mommy
from django.core.urlresolvers import reverse
from helper import test_helper
from nose.tools import with_setup

def createProductWithSku(sku_str):
	product = mommy.make('product.Product')
	sku = mommy.make('product.Sku',sku=sku_str)
	prodSkuAssoc = mommy.make('product.ProdSkuAssoc',product=product,sku=sku)
	return prodSkuAssoc.product

class SearchSkuTest(WebTest):

    # @with_setup(test_helper.setup_test_couchdb, test_helper.teardown_test_couchdb)
    def test_can_search_sku_productInStore(self):
        test_helper.setup_test_couchdb()

        #FIXTURE----------------------------------------------------------
        #create user and store
        user,store = test_helper.create_user_then_store()
        #create product
        sku_str = '123'
        product = test_helper.createProductWithSku(sku_str)
 		#make this product belong to this store
        store_product = test_helper.associateProductAndBusiness(product=product,business=store)

        #MAKING REQUEST---------------------------------------------------
        res = self.app.get(
            reverse('store_product:search_product'),
            user = user
        )
        self.assertEqual(res.status_int,200)

        #SKU SEARCH
        sku_form = res.forms['sku']
        sku_form['sku'] = sku_str
        res = sku_form.submit()
        self.assertEqual(res.status_int,200)

        #PRODUCT RESULT EXIST 
        product_lst = res.context['product_lst']
        self.assertEqual(len(product_lst),1)
        
        #PRODUCT BELONG TO THE STORE
        product = product_lst[0]
        self.assertEqual(product.bus_lst.all()[0],store) 

        test_helper.teardown_test_couchdb()
    
    # @with_setup(test_helper.setup_test_couchdb, test_helper.teardown_test_couchdb)
    def test_can_search_sku_productOutSTore(self):
        #coverage run manage.py test --settings=settings.test store_product.tests.test_skuSearch:SearchSkuTest.test_can_search_sku_productOutSTore

        test_helper.setup_test_couchdb()
        #FIXTURE----------------------------------------------------------
        #create user and store
        user,thisStore = test_helper.create_user_then_store()
        #create product
        sku_str = '123'
        product = test_helper.createProductWithSku(sku_str)
        #make this product belong to another store
        anotherStore = mommy.make('bus.Business')
        store_product = mommy.make('store_product.Store_product',product=product,business=anotherStore)

        #MAKING REQUEST---------------------------------------------------
        res = self.app.get(
            reverse('store_product:search_product'),
            user = user
        )
        self.assertEqual(res.status_int,200)

        #SKU SEARCH
        sku_form = res.forms['sku']
        sku_form['sku'] = sku_str
        res = sku_form.submit()
        self.assertEqual(res.status_int,200)

        #PRODUCT RESULT EXIST 
        product_lst = res.context['product_lst']
        self.assertEqual(len(product_lst),1)
        
        #PRODUCT BELONG TO THE OTHER STORE
        product = product_lst[0]
        self.assertEqual(product.bus_lst.all()[0],anotherStore) 

        test_helper.teardown_test_couchdb

    # @with_setup(test_helper.setup_test_couchdb, test_helper.teardown_test_couchdb)
    def test_can_not_search_sku_whenSkuIsNotExist(self):
        #coverage run manage.py test --settings=settings.test store_product.tests.test_skuSearch:SearchSkuTest.test_can_not_search_sku_whenSkuIsNotExist
        test_helper.setup_test_couchdb()
        #FIXTURE----------------------------------------------------------
        #create user and store
        user,thisStore = test_helper.create_user_then_store()
        #create product
        sku_str = '123'
        product = test_helper.createProductWithSku(sku_str)
        #make this product belong to another store
        anotherStore = mommy.make('bus.Business')
        store_product = mommy.make('store_product.Store_product',product=product,business=anotherStore)

        #MAKING REQUEST---------------------------------------------------
        res = self.app.get(
            reverse('store_product:search_product'),
            user = user
        )
        self.assertEqual(res.status_int,200)

        #SKU SEARCH
        sku_form = res.forms['sku']
        another_sku = '456'
        sku_form['sku'] = another_sku
        res = sku_form.submit()
        self.assertEqual(res.status_int,200)

        #PRODUCT RESULT NOT EXIST 
        product_lst = res.context['product_lst']
        self.assertEqual(len(product_lst),0)
        
        test_helper.teardown_test_couchdb
