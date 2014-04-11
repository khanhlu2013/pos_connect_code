from django_webtest import WebTest
from django.core.urlresolvers import reverse
from helper import test_helper
from store_product import new_sp_inserter

class test(WebTest):   
    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def sku_search_ajax_resultFoundInMyStore_test(self):
        """
            Search result is found and exist in my store. No lookup_type_tag included in response
        """
        #foreman  run -e .env,test.env python manage.py test test.store_product.sp_search_sku_test:test.sku_search_ajax_resultFoundInMyStore_test

        my_user,my_store = test_helper.create_user_then_store()
        sku_str = '123'

        sp = new_sp_inserter.exe(
             store_id = my_store.id
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
             '/product/search/sku_ajax'
            ,params={'sku_str':sku_str}
            ,user=my_user
        )
        self.assertEqual(res.status_int,200)
        
        #product list
        prod_json_lst = res.json['prod_lst']
        self.assertEqual(len(prod_json_lst),1)
        
        prod_json = prod_json_lst[0]
        sp_json_lst = prod_json['store_product_set']
        self.assertEqual(len(sp_json_lst),1)
        
        sp_json = sp_json_lst[0]
        self.assertEqual(sp_json['product_id'],sp.product.id)
        self.assertEqual(sp_json['store_id'],my_store.id)

        #lookup type tag
        lookup_type_tag = res.json['lookup_type_tag']
        self.assertEqual(lookup_type_tag,None)


    def sku_search_ajax_resultFoundInOtherStore_test(self):
        """
            Search result is found but not exist in my store. Lookup_type_tag included in response
        """
        #foreman  run -e .env,test.env python manage.py test test.store_product.sp_search_sku_test:test.sku_search_ajax_resultFoundInOtherStore_test

        my_user,my_store = test_helper.create_user_then_store()
        
        #FIXTURE FOR RETURN LOOKUP TYPE TAG
        #in order to test lookup type tag, which include when result is not found in my store, i need to create some dummy product so we have a lookup type tag for my store
        # end result for p_type and tag will be {type_1:[tag_1_a,tag_1_b] , type_2:[tag_2_a]}
        type_1 = 'type_1'
        tag_1_a = 'tag_1_a'
        tag_1_b = 'tag_1_b'
        
        type_2 = 'type_2'
        tag_2_a = 'tag_2_a'

        sp = new_sp_inserter.exe(
             store_id = my_store.id
            ,name = 'my product name 1'
            ,price = 1
            ,crv = 1
            ,is_taxable = True
            ,is_sale_report = False
            ,p_type = type_1
            ,p_tag = tag_1_a
            ,sku_str = '1'
        )

        sp = new_sp_inserter.exe(
             store_id = my_store.id
            ,name = 'my product name 1'
            ,price = 1
            ,crv = 1
            ,is_taxable = True
            ,is_sale_report = False
            ,p_type = type_1
            ,p_tag = tag_1_b
            ,sku_str = '2'
        )

        sp = new_sp_inserter.exe(
             store_id = my_store.id
            ,name = 'my product name 1'
            ,price = 1
            ,crv = 1
            ,is_taxable = True
            ,is_sale_report = False
            ,p_type = type_2
            ,p_tag = tag_2_a
            ,sku_str = '3'
        )

        #FIXTURE FOR RETURN SUGGEST PRODUCT
        sku_str = '123'
        other_user,other_store = test_helper.create_user_then_store()
        sp = new_sp_inserter.exe(
             store_id = other_store.id
            ,name = 'other store product name'
            ,price = 1
            ,crv = 1
            ,is_taxable = True
            ,is_sale_report = False
            ,p_type = None
            ,p_tag = None
            ,sku_str = sku_str
        )

        #MAKE REQUEST
        res = self.app.get(
             # reverse('store_product:search_sku_ajax')
             '/product/search/sku_ajax'
            ,params={'sku_str':sku_str}
            ,user=my_user
        )
        self.assertEqual(res.status_int,200)
        
        #product list
        prod_json_lst = res.json['prod_lst']
        self.assertEqual(len(prod_json_lst),1)
        
        prod_json = prod_json_lst[0]
        sp_json_lst = prod_json['store_product_set']
        self.assertEqual(len(sp_json_lst),1)
        
        sp_json = sp_json_lst[0]
        self.assertEqual(sp_json['product_id'],sp.product.id)
        self.assertEqual(sp_json['store_id'],other_store.id)

        #lookup type tag
        lookup_type_tag = res.json['lookup_type_tag']
        self.assertEqual(len(lookup_type_tag),2)
        tag_1_lst = lookup_type_tag[type_1]
        self.assertEqual(len(tag_1_lst),2)
        self.assertTrue(tag_1_a in tag_1_lst)
        self.assertTrue(tag_1_b in tag_1_lst)

        tag_2_lst = lookup_type_tag[type_2]
        self.assertTrue(len(tag_2_lst),1)
        self.assertTrue(tag_2_a in tag_2_lst)
