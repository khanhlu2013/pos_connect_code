from django_webtest import WebTest
from django.core.urlresolvers import reverse
from model_mommy import mommy
from helper import test_helper
from store_product import insert_new_store_product_cm,insert_old_store_product_cm
from product.models import ProdSkuAssoc

class Test(WebTest):    
    def test_can_not_delete_sku_when_it_belong_to_other_store(self):
    	#coverage run manage.py test --settings=settings.test store_product.tests.test_delete_sku_specialCase:Test.test_can_not_delete_sku_when_it_belong_to_other_store
				
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
		self.assertEqual(prod_bus_assoc_this.product,prod_sku_assoc.product)
		self.assertEqual(prod_bus_assoc_this.business,store_this)

		#ASSOCIATE THIS PRODUCT TO ANOTHER STORE
		user_other,store_other = test_helper.create_user_then_store()
		prod_bus_assoc_other = insert_old_store_product_cm.exe( \
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
		
		prod_sku_assoc_lst = ProdSkuAssoc.objects.filter(product__id=prod_bus_assoc_this.product.id)
		self.assertEqual(len(prod_sku_assoc_lst),1)
		prod_sku_assoc = prod_sku_assoc_lst[0]
		self.assertEqual(prod_sku_assoc.product,prod_bus_assoc_this.product)
		prod_bus_assoc_lst = prod_sku_assoc.store_product_lst.all()
		self.assertEqual(len(prod_bus_assoc_lst),2)
		self.assertTrue(prod_bus_assoc_this in prod_bus_assoc_lst)
		self.assertTrue(prod_bus_assoc_other in prod_bus_assoc_lst)

		#MAKE REQUEST
		try:
 			res = self.app.get(
				reverse(
					'store_product:delete_sku',
					kwargs={'pk':prod_sku_assoc.id}
				),
				user=user_this)
 			self.assertFalse()
 		except:
 			pass

		#TEARDOWN COUCHDB TEST-------
		test_helper.teardown_test_couchdb()