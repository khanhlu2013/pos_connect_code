from django_webtest import WebTest
from django.core.urlresolvers import reverse
from model_mommy import mommy
from store_product import new_sp_inserter
from helper import test_helper
import json

class test(WebTest):   
    csrf_checks = False

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def update_parent_and_add_child_test(self):
        #foreman  run -e .env,test.env python manage.py test test.mix_match.mix_match_update_view_test:test.update_parent_and_add_child_test       

        user,store = test_helper.create_user_then_store()
        sp = new_sp_inserter.exe( \
             store_id = store.id            
            ,name = "Jack Daniel"
            ,price = 1
            ,crv = None
            ,is_taxable = True
            ,is_sale_report = True
            ,p_type = None
            ,p_tag = None
            ,sku_str = '123' 
            ,cost = None
            ,vendor = None
            ,buydown = None
        )

        #create mix match parent
        mix_match_name = '3 for $5'
        mix_match_qty = 2
        mix_match_otd_price = 2
        mix_match = mommy.make('mix_match.Mix_match',store=store,name='x',qty=1,otd_price=1)

        
        #MAKE REQUEST
        res = self.app.post(
             '/mix_match/update'
            ,{
                 'id':mix_match.id
                ,'name':mix_match_name
                ,'qty':mix_match_qty
                ,'otd_price':mix_match_otd_price
                ,'pid_comma_separated_lst_str':str(sp.product.id)
            }
            ,user=user)

        self.assertEqual(res.status_int,200)
        
        #asert context
        mm = res.json
        self.assertTrue(mm!=None)

        self.assertEqual(mm['name'],mix_match_name)
        self.assertEqual(mm['otd_price'],str(mix_match_otd_price))
        self.assertEqual(mm['qty'],mix_match_qty)
        #assert mm child
        mm_child_set = mm['mix_match_child_set']
        self.assertTrue(mm_child_set!=None)
        self.assertEqual(len(mm_child_set),1)
        mm_child = mm_child_set[0]
        #assert mm child sp
        mm_child_sp = mm_child['store_product']
        self.assertEqual(mm_child_sp['product_id'],sp.product.id)


    def remove_child_test(self):
        #foreman  run -e .env,test.env python manage.py test test.mix_match.mix_match_update_view_test:test.remove_child_test       

        user,store = test_helper.create_user_then_store()
        sp1 = new_sp_inserter.exe( \
             store_id = store.id            
            ,name = "Product 1"
            ,price = 1
            ,crv = None
            ,is_taxable = True
            ,is_sale_report = True
            ,p_type = None
            ,p_tag = None
            ,sku_str = '111' 
            ,cost = None
            ,vendor = None
            ,buydown = None
        )

        sp2 = new_sp_inserter.exe( \
             store_id = store.id            
            ,name = "Product 2"
            ,price = 1
            ,crv = None
            ,is_taxable = True
            ,is_sale_report = True
            ,p_type = None
            ,p_tag = None
            ,sku_str = '222' 
            ,cost = None
            ,vendor = None
            ,buydown = None
        )

        mix_match = mommy.make('mix_match.Mix_match',store=store,name='x',qty=1,otd_price=1)
        mommy.make('mix_match.Mix_match_child',parent=mix_match,store_product=sp1)
        mommy.make('mix_match.Mix_match_child',parent=mix_match,store_product=sp2)
        
        #MAKE REQUEST
        res = self.app.post(
             '/mix_match/update'
            ,{
                 'id':mix_match.id
                ,'name':'x'
                ,'qty':1
                ,'otd_price':1
                ,'pid_comma_separated_lst_str':str(sp1.product.id)
            }
            ,user=user)

        self.assertEqual(res.status_int,200)
        
        #asert context
        mm = res.json
        self.assertTrue(mm!=None)

        #assert mm child
        mm_child_set = mm['mix_match_child_set']
        self.assertTrue(mm_child_set!=None)
        self.assertEqual(len(mm_child_set),1)
        mm_child = mm_child_set[0]
        #assert mm child sp
        mm_child_sp = mm_child['store_product']
        self.assertEqual(mm_child_sp['product_id'],sp1.product.id)


