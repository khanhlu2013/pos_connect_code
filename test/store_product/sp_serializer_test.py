from django_webtest import WebTest
from helper import test_helper
from store_product import new_sp_inserter,sp_serializer

class test(WebTest):   
    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        # foreman  run -e .env,test.env python manage.py test test.store_product.sp_serializer_test:test.test         
        
        user,store = test_helper.create_user_then_store()
        sku_str = '123'
        name = 'my product name'
        price = 1
        crv = 1
        is_taxable = True
        is_sale_report = False
        p_type = 'type'
        p_tag = 'tag'

        sp = new_sp_inserter.exe(
             store_id = store.id
            ,name = name
            ,price = price
            ,crv = crv
            ,is_taxable = is_taxable
            ,is_sale_report = is_sale_report
            ,p_type = p_type
            ,p_tag = p_tag
            ,sku_str = sku_str
        )

        product_serialized = sp_serializer.serialize_product_from_id(product_id = sp.product.id,store_id = store.id,is_include_other_store=False)
        sp_serialied_set = product_serialized['store_product_set']
        self.assertEqual(len(sp_serialied_set),1)
        
        sp_serialized = sp_serialied_set[0]
        self.assertEqual(sp_serialized['product_id'],sp.product.id)
        self.assertEqual(sp_serialized['store_id'],store.id)
        self.assertEqual(sp_serialized['price'],str(price))
        self.assertEqual(sp_serialized['crv'],str(crv))
        self.assertEqual(sp_serialized['is_taxable'],is_taxable)
        self.assertEqual(sp_serialized['is_sale_report'],is_sale_report)
        self.assertEqual(sp_serialized['p_type'],p_type)
        self.assertEqual(sp_serialized['p_tag'],p_tag)


        prodskuassoc_serialized_set = product_serialized['prodskuassoc_set']
        self.assertEqual(len(prodskuassoc_serialized_set),1)
        prodskuassoc_serialized = prodskuassoc_serialized_set[0]
        print(prodskuassoc_serialized);

        self.assertTrue(all(key in prodskuassoc_serialized for key in ['sku_str','store_set','creator_id','product_id']))
        self.assertEqual(prodskuassoc_serialized['sku_str'],sku_str)
        self.assertEqual(len(prodskuassoc_serialized['store_set']),1)
        self.assertEqual(prodskuassoc_serialized['creator_id'],store.id)
        self.assertEqual(prodskuassoc_serialized['product_id'],sp.product.id)




