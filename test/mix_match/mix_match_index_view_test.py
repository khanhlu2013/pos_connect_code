from django_webtest import WebTest
from django.core.urlresolvers import reverse
from model_mommy import mommy
from store_product import new_sp_inserter
from helper import test_helper
import json

class test(WebTest):   
    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        """
            create a mix match, and make sure view context include this mixmatch with correct json data
        """
        #foreman  run -e .env,test.env python manage.py test test.mix_match.mix_match_index_view_test:test.test       


        user,store = test_helper.create_user_then_store()

        #create sp
        product_name = "Jack Daniel"
        price = 1.1
        crv = 1.2
        is_taxable = True
        is_sale_report = False
        p_type = 'type'
        p_tag = 'tag'
        sku_str = '123'
        cost = 1.3
        vendor = 'pitco'
        buydown = 1.4        
        sp = new_sp_inserter.exe( \
             store_id = store.id            
            ,name = product_name
            ,price = price
            ,crv = crv
            ,is_taxable = is_taxable
            ,is_sale_report = is_sale_report
            ,p_type = p_type
            ,p_tag = p_tag
            ,sku_str = sku_str 
            ,cost = cost
            ,vendor = vendor
            ,buydown = buydown
        )

        #create mix match parent
        mix_match_name = '3 for $5'
        mix_match_qty = 3
        mix_match_unit_discount = 0.1
        mix_match = mommy.make('mix_match.Mix_match',store=store,name=mix_match_name,qty=mix_match_qty,unit_discount=mix_match_unit_discount)
        #create mix match child
        mix_match_child = mommy.make('mix_match.Mix_match_child',parent=mix_match,store_product=sp)


        #MAKE REQUEST
        res = self.app.get(reverse('mix_match:mix_match'), user=user)
        self.assertEqual(res.status_int,200)
        
        #asert context
        self.assertTrue(res.context['tax_rate']!=None)
        mm_lst = json.loads(res.context['mix_match_lst'])
        self.assertEqual(len(mm_lst),1)
        
        #assert mm
        mm = mm_lst[0]
        self.assertEqual(mm['name'],mix_match_name)
        self.assertEqual(mm['unit_discount'],str(mix_match_unit_discount))
        self.assertEqual(mm['qty'],mix_match_qty)
        #assert mm child
        mm_child_set = mm['mix_match_child_set']
        self.assertTrue(mm_child_set!=None)
        self.assertEqual(len(mm_child_set),1)
        mm_child = mm_child_set[0]
        #assert mm child sp
        mm_child_sp = mm_child['store_product']
        self.assertEqual(mm_child_sp['product_id'],sp.product.id)
        self.assertEqual(mm_child_sp['store_id'],store.id)
        self.assertEqual(mm_child_sp['name'],product_name)
        self.assertEqual(mm_child_sp['price'],str(price))
        self.assertEqual(mm_child_sp['crv'],str(crv))
        self.assertEqual(mm_child_sp['is_taxable'],is_taxable)        
        self.assertEqual(mm_child_sp['p_type'],p_type)
        self.assertEqual(mm_child_sp['p_tag'],p_tag)
        self.assertEqual(mm_child_sp['buydown'],str(buydown))

        


