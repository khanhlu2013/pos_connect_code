from django_webtest import WebTest
from django.core.urlresolvers import reverse
from helper import test_helper
from store_product import new_sp_inserter,sp_search_view

class Test(WebTest):   
    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def serialize_product_test(self):
        # foreman  run -e .env,test.env python manage.py test store_product.tests.sp_search_test:Test.serialize_product_test         
        
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

        prod_lst = sp_search_view.search_product_by_sku(sku_str)
        prod_json_lst = sp_search_view.serialize_prod_lst(prod_lst)

        self.assertEqual(len(prod_json_lst),1)
        prod_json = prod_json_lst[0]
        sp_json_set = prod_json['store_product_set']
        self.assertEqual(len(sp_json_set),1)
        
        sp_json = sp_json_set[0]
        self.assertEqual(sp_json['product_id'],sp.product.id)
        self.assertEqual(sp_json['store_id'],store.id)
        self.assertEqual(sp_json['price'],str(price))
        self.assertEqual(sp_json['p_type'],p_type)
        self.assertEqual(sp_json['p_tag'],p_tag)
        self.assertEqual(sp_json['is_taxable'],is_taxable)

        prodskuassoc_set = prod_json['prodskuassoc_set']
        self.assertEqual(len(prodskuassoc_set),1)
        prodskuassoc = prodskuassoc_set[0]
        self.assertEqual(prodskuassoc['sku_str'],sku_str)
        self.assertEqual(prodskuassoc['popularity'],1)


    def sp_search_by_sku_ajax_test(self):
        #foreman  run -e .env,test.env python manage.py test store_product.tests.sp_search_test:Test.sp_search_by_sku_ajax_test         

        user,store = test_helper.create_user_then_store()
        sku_str = '123'

        sp = new_sp_inserter.exe(
             store_id = store.id
            ,name = 'my product name'
            ,price = 1
            ,crv = 1
            ,is_taxable = True
            ,is_sale_report = False
            ,p_type = 'type'
            ,p_tag = 'tag'
            ,sku_str = sku_str
        )

        res = self.app.get(
             reverse('store_product:search_sku_ajax')
            ,params={'sku_str':sku_str}
            ,user=user
        )
        self.assertEqual(res.status_int,200)
        
        #exist product list
        exist_product_json_lst = res.json['exist_product_lst']
        self.assertEqual(len(exist_product_json_lst),1)
        exist_product_json = exist_product_json_lst[0]
        sp_json_set = exist_product_json['store_product_set']
        self.assertEqual(len(sp_json_set),1)
        sp_json = sp_json_set[0]
        self.assertEqual(sp_json['product_id'],sp.product.id)

        #suggest product list
        suggest_product_json_lst = res.json['suggest_product_lst']
        self.assertEqual(len(suggest_product_json_lst),0)
