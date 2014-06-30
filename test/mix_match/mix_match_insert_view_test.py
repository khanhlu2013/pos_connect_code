from django_webtest import WebTest
from django.core.urlresolvers import reverse
from model_mommy import mommy
from store_product import new_sp_inserter
from helper import test_helper
import json
from util import boolean

class test(WebTest):   
    csrf_checks = False

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        #foreman  run -e .env,test.env python manage.py test test.mix_match.mix_match_insert_view_test:test.test       

        user,store = test_helper.create_user_then_store()
        sp = test_helper.insert_new_sp(store_id=store.id)

        #MAKE REQUEST
        mix_match_name = '3 for $5'
        mix_match_qty = 2
        mm_price = 2
        is_include_crv_tax = True

        res = self.app.post(
             '/mix_match/insert'
            ,{
                 'name':mix_match_name
                ,'qty':mix_match_qty
                ,'mm_price':mm_price
                ,'is_include_crv_tax': boolean.py_2_js_str(is_include_crv_tax)
                ,'pid_comma_separated_lst_str':str(sp.product.id)
            }
            ,user=user)
        self.assertEqual(res.status_int,200)
        

        #asert context
        mm = res.json
        self.assertTrue(mm!=None)

        self.assertEqual(mm['name'],mix_match_name)
        self.assertEqual(mm['mm_price'],str(mm_price))
        self.assertEqual(mm['is_include_crv_tax'],is_include_crv_tax)

        self.assertEqual(mm['qty'],mix_match_qty)
        #assert mm child
        mm_child_set = mm['mix_match_child_set']
        self.assertTrue(mm_child_set!=None)
        self.assertEqual(len(mm_child_set),1)
        mm_child = mm_child_set[0]
        #assert mm child sp
        mm_child_sp = mm_child['store_product']
        self.assertEqual(mm_child_sp['product_id'],sp.product.id)


