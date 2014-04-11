from django_webtest import WebTest
from store_product import old_sp_inserter,new_sp_inserter
from store_product.models import Store_product
from store_product.sp_couch import store_product_couch_getter
from model_mommy import mommy
from helper import test_helper

class test(WebTest):

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        #foreman  run -e .env,test.env python manage.py test test.store_product.old_sp_inserter_test:test.test
        """
            .insert a new store_product to x_store
            .insert that same product to my_store
            .verify my_store_product in master.store_product
            .verify my_store_product in couch.store_product
        """
        #.insert a new store_product to x_store
        x_user,x_store = test_helper.create_user_then_store()
        sku_str = '1234'
        x_store_product = new_sp_inserter.exe(
             store_id = x_store.id            
            ,name = "x"
            ,price = None
            ,crv = None
            ,is_taxable = False
            ,is_sale_report = False
            ,p_type = None
            ,p_tag = None
            ,sku_str = sku_str
        )
        
        #.insert that same product to my_store, use default approve_frequency = 2
        my_user,my_store = test_helper.create_user_then_store()
        name = 'my product name'
        price = 1
        crv = 1
        is_taxable = True
        is_sale_report = True
        p_type = 'type'
        p_tag = 'tag'

        old_sp_inserter.exe (
             product_id = x_store_product.product.id
            ,store_id = my_store.id
            ,name = name
            ,price = price
            ,crv = crv
            ,is_taxable = is_taxable
            ,is_sale_report = is_sale_report
            ,p_type = p_type
            ,p_tag = p_tag
            ,assoc_sku_str = sku_str
        )


        #.verify my_store_product in master.store_product
        my_store_product = Store_product.objects.get(product_id=x_store_product.product.id,store_id=my_store.id)
        self.assertTrue(my_store_product!=None)
        self.assertEqual(my_store_product.name,name)
        self.assertEqual(my_store_product.price,price)
        self.assertEqual(my_store_product.crv,crv)
        self.assertEqual(my_store_product.is_taxable,is_taxable)
        self.assertEqual(my_store_product.is_sale_report,is_sale_report)
        self.assertEqual(my_store_product.p_type,p_type)
        self.assertEqual(my_store_product.p_tag,p_tag)
        self.assertEqual(len(my_store_product.product.sku_lst.all()),1)
        self.assertEqual(my_store_product.product.sku_lst.all()[0].sku,sku_str)

        #.verify my_store_product in couch.store_product
        my_store_product_couch = store_product_couch_getter.exe(x_store_product.product.id,my_store.id)
        self.assertTrue(my_store_product_couch!=None)
        self.assertEqual(my_store_product_couch['store_id'],my_store.id )
        self.assertEqual(my_store_product_couch['product_id'],x_store_product.product.id )        
        self.assertEqual(my_store_product_couch['name'],name)
        self.assertEqual(my_store_product_couch['price'],str(price))
        self.assertEqual(my_store_product_couch['crv'],str(crv))
        self.assertEqual(my_store_product_couch['is_taxable'],is_taxable)
        self.assertEqual(my_store_product_couch['is_sale_report'],is_sale_report)    
        self.assertEqual(my_store_product_couch['p_type'],p_type) 
        self.assertEqual(my_store_product_couch['p_tag'],p_tag)         
        sku_lst = my_store_product_couch['sku_lst']
        self.assertEqual(len(sku_lst),1)
        self.assertTrue(sku_str in sku_lst)




