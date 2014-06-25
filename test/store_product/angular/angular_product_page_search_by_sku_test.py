from django_webtest import WebTest
from helper import test_helper
from store_product import add_sku_cm
class test(WebTest):

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    """
        INTRO: there are 3 object return from this sku search view
            . prod_store__prod_sku__1_1 : store_product type
            . prod_store__prod_sku__1_0 : store_product type
            . prod_store__prod_sku__0_0 : product type

        TEST PLAN
            . if prod_store__prod_sku__1_1__isNotEmpty_test
                -> prod_store__prod_sku__1_0 && prod_store__prod_sku__0_0 MUST BE NULL: we don't care for more information when we found the sku we need in side our store

            . if prod_store__prod_sku__1_1__isEmpty_test (this mean our() store does not have this sku, but we might or might not have this product)
                -> we can setup test so that we can see suggestion is suggested correctly
    """
    
    def prod_store__prod_sku__1_1__isEmpty_test(self):
        #
        """
            foreman  run -e .env,test.env python manage.py test test.store_product.angular.angular_product_page_search_by_sku_test:test.prod_store__prod_sku__1_1__isEmpty_test

            SETUP:
                i create product_a with sku_a
                she import product_a from my store using sku_a
                she add sku_b into product_a
                she create product_b with sku_b

            TEST:
                when i scan sku_b i expect:
                    . prod_store__prod_sku__1_1 : empty
                    . prod_store__prod_sku__1_0 : product_a should be here since i have product_a, but i don't have sku_b
                    . prod_store__prod_sku__0_0 : product_b should be here      
        """        
        i,my_store = test_helper.create_user_then_store()
        she,her_store = test_helper.create_user_then_store()

        #SETUP
        sku_a = 'sku_a'
        sku_b = 'sku_b'
        #i create product_a with sku_a
        product_a = test_helper.create_bare_sp(store_id=my_store.id,sku_str=sku_a)
        print('product_a id ' + str(product_a.id))
        #she import product_a from my store using sku_a
        test_helper.insert_old_sp(store_id=her_store.id,product_id=product_a.id,sku_str=sku_a)

        #she add sku_b into product_a
        add_sku_cm.exe(sku_str=sku_b,product_id=product_a.id,store_id=her_store.id)

        #she create product_b with sku_b
        product_b = test_helper.create_bare_sp(store_id=her_store.id,sku_str=sku_b)
        print('product_b id ' + str(product_b.id))

        #TEST
        response = self.app.get('/product/angular_product_page_search_by_sku',params={'sku_str':sku_b},user=i)
        self.assertEqual(response.status_int,200)
        json_response = response.json
        
        #expect sp_lst_1_1_json to be empty
        sp_lst_1_1_json = json_response['prod_store__prod_sku__1_1']
        self.assertEqual(len(sp_lst_1_1_json),0)

        #expect sp_lst_1_0_json to have product_a
        sp_lst_1_0_json = json_response['prod_store__prod_sku__1_0']
        self.assertEqual(len(sp_lst_1_0_json),1)
        sp_1_0_json = sp_lst_1_0_json[0]
        self.assertEqual(sp_1_0_json['product_id'],product_a.id)

        #expect p_lst_0_0_json to have product_b
        p_lst_0_0_json = json_response['prod_store__prod_sku__0_0']
        self.assertEqual(len(p_lst_0_0_json),1)
        p_b_0_0_json = p_lst_0_0_json[0]
        print(p_b_0_0_json)
        sp_b_lst_0_0_json = p_b_0_0_json['store_product_set']
        self.assertEqual(len(sp_b_lst_0_0_json),1)
        sp_b_0_0_json = sp_b_lst_0_0_json[0]
        self.assertEqual(sp_b_0_0_json['product_id'],product_b.product.id)


    def prod_store__prod_sku__1_1__isNotEmpty_test(self):
        """
            foreman  run -e .env,test.env python manage.py test test.store_product.angular.angular_product_page_search_by_sku_test:test.prod_store__prod_sku__1_1__isNotEmpty_test

            SETUP:
                i create product_a with sku_a and product_b with sku_b
                she import product_b from my store using sku_b
                she create product_c with sku_a
                she add sku_a to product_b (after she did this, when i scan sku_a, beside my sku search result should obviously include product_a, it COULD HAVE included product_b. But i don't want product_b in my search result since she(not me) did this action
            TEST:
                when i scan sku_a i only want to see product_a, not product_b and product_c
        """

        i,my_store = test_helper.create_user_then_store()
        she,her_store = test_helper.create_user_then_store()

        #SETUP
        #i create product_a with sku_a and product_b with sku_b
        sku_a = 'sku_a'
        sku_b = 'sku_b'
        product_a = test_helper.create_bare_sp(store_id=my_store.id,sku_str=sku_a)
        product_b = test_helper.create_bare_sp(store_id=my_store.id,sku_str=sku_b)

        #she import product_b from my store using sku_b
        test_helper.insert_old_sp(store_id=her_store.id,product_id=product_b.id,sku_str=sku_b)

        #she create product_c with sku_a
        product_c = test_helper.create_bare_sp(store_id=her_store.id,sku_str=sku_a)

        #she add sku_a to product_b
        add_sku_cm.exe(sku_str=sku_a,product_id=product_b.id,store_id=her_store.id)

        #TEST
        response = self.app.get('/product/angular_product_page_search_by_sku',params={'sku_str':sku_a},user=i)
        self.assertEqual(response.status_int,200)
        json_response = response.json

        self.assertEqual(json_response['prod_store__prod_sku__1_0'],None)
        self.assertEqual(json_response['prod_store__prod_sku__0_0'],None)
        sp_lst_1_1_json = json_response['prod_store__prod_sku__1_1']
        self.assertEqual(len(sp_lst_1_1_json),1)
        sp_1_1_json = sp_lst_1_1_json[0]
        self.assertEqual(sp_1_1_json['product_id'],product_a.id)

