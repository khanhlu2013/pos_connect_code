from django_webtest import WebTest
from django.core.urlresolvers import reverse
from model_mommy import mommy
from helper import test_helper
from product.models import Product
from store_product import insert_new_store_product_cm,insert_old_store_product_cm
from store_product.couch import store_product_couch_getter
from decimal import Decimal

class Test(WebTest):
	def test(self):
		#coverage run manage.py test --settings=settings.test store_product.tests.test_insert_sku:Test.test
				
		#SETUP COUCHDB TEST
		test_helper.setup_test_couchdb()

		#FIXTURE
		#CREATE A PRODUCT FOR THIS STORE
		user_this,store_this = test_helper.create_user_then_store()
		sku_str = '123'
		product_name = "Jack Daniel"
		price = 2.99
		crv = None
		prod_bus_assoc_this = insert_new_store_product_cm.exe( \
			 name = product_name
			,price = price
			,crv = None
			,department = None
			,isTaxable = True
			,isTaxReport = True
			,isSaleReport = True
			,business_id = store_this.id
			,sku_str = sku_str )

		prod_sku_assoc_lst = prod_bus_assoc_this.product.prodskuassoc_set.all()
		self.assertEqual(len(prod_sku_assoc_lst),1)
		prod_sku_assoc = prod_sku_assoc_lst[0]

		#ASSOCIATE THIS PRODUCT TO ANOTHER STORE
		store_other = mommy.make('store.Store')
		insert_old_store_product_cm.exe( \
			 product = prod_bus_assoc_this.product
			,business_id = store_other.id
			,name = product_name
			,price = price
			,crv = crv
			,isTaxable = True
			,department = None
 			,isTaxReport = True
			,isSaleReport = True
			,assoc_sku_str = sku_str )


		#MAKE REQUEST TO ADD SKU TO THIS STORE
		res = self.app.get(reverse('store_product:add_sku',kwargs={'prod_bus_assoc_id':prod_bus_assoc_this.id}),user=user_this)
		self.assertEqual(res.status_int,200)

		#TEST REQUEST RESPONSE-------
		sku_lst = res.context['prodskuassoc_lst']
		self.assertEqual(len(sku_lst),1)
		self.assertEqual(sku_lst[0].sku.sku,sku_str)

		#FILL OUT ADD SKU FORM-------
		form = res.form
		new_sku_str = '234'
		form['sku_field'] = new_sku_str
		res = form.submit().follow()
		self.assertEqual(res.status_int,200)

		#TEST FORM SUBMITION RESPONSE
		sku_lst = [prod_sku_assoc.sku.sku for prod_sku_assoc in res.context['prodskuassoc_lst']]
		self.assertEqual(len(sku_lst),2)
		self.assertTrue(sku_str in sku_lst)
		self.assertTrue(new_sku_str in sku_lst)

		#TEST RELATIONAL DB
		product_rel = Product.objects.get(pk=prod_bus_assoc_this.id)
		rel_prod_sku_assoc_lst = product_rel.prodskuassoc_set.all()
		self.assertTrue(len(rel_prod_sku_assoc_lst),2)
		rel_sku_str_lst = [prod_sku_assoc.sku.sku for prod_sku_assoc in rel_prod_sku_assoc_lst]
		self.assertTrue(new_sku_str in rel_sku_str_lst)
		self.assertTrue(sku_str in rel_sku_str_lst)

		#TEST COUCH DB
		#this store, there is 2 sku
		couchdb_prod_bus_assoc_this = store_product_couch_getter.exe(product_rel.id,store_this.id)
		couchdb_sku_this_lst = couchdb_prod_bus_assoc_this['sku_lst']
		self.assertEqual(len(couchdb_sku_this_lst),2)
		self.assertTrue(sku_str in couchdb_sku_this_lst)
		self.assertTrue(new_sku_str in couchdb_sku_this_lst)
		
		#other store, there is only 1 sku, the original one. Sku added to this store does not add to other store
		couchdb_prod_bus_assoc_other = store_product_couch_getter.exe(product_rel.id,store_other.id)
		couchdb_sku_other_lst = [cur_sku for cur_sku in couchdb_prod_bus_assoc_other['sku_lst']]
		self.assertEqual(len(couchdb_sku_other_lst),1)
		self.assertTrue(sku_str in couchdb_sku_other_lst)

		#TEARDOWN COUCHDB TEST-------
		test_helper.teardown_test_couchdb()
