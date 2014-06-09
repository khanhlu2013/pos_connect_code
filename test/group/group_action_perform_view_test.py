from django_webtest import WebTest
from django.core.urlresolvers import reverse
from model_mommy import mommy
from store_product import new_sp_inserter
from helper import test_helper
import json
from util import boolean
from store_product.sp_couch import store_product_couch_getter

class test(WebTest):   
    csrf_checks = False

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()


    def test(self):
        """
            change all sp info except price. This test verify action perform view works.
        """

        #foreman  run -e .env,test.env python manage.py test test.group.group_action_perform_view_test:test.test       

        user,store = test_helper.create_user_then_store()
        old_price = 0.1
        sp1 = new_sp_inserter.exe( \
             store_id = store.id            
            ,name = "Product 1"
            ,price = old_price
            ,value_customer_price = None
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
            ,price = old_price
            ,value_customer_price = None
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

        group = mommy.make('group.Group',store=store,name='x')
        mommy.make('group.Group_child',group=group,store_product=sp1)
        mommy.make('group.Group_child',group=group,store_product=sp2)
        
        price = ''
        crv = 1.2
        is_taxable = 'true'
        is_sale_report = 'true'
        p_type = 'type'
        p_tag = 'tag'
        vendor = 'pitco'
        cost = 1.3
        buydown = 1.4


        data = {
             'id':group.id
            ,'price':price
            ,'crv':crv
            ,'is_taxable':is_taxable
            ,'is_sale_report':is_sale_report
            ,'p_type':p_type
            ,'p_tag':p_tag
            ,'vendor':vendor
            ,'cost':cost
            ,'buydown':buydown     
        }
        #MAKE REQUEST
        res = self.app.post(
             '/group/action'
            ,data
            ,user=user)

        self.assertEqual(res.status_int,200)
        self.assertEqual(res.json['row_update'],2)

        #asert parent
        group = res.json['group_lst'][0]
        self.assertTrue(group!=None)

        #assert child in master
        group_child_set = group['group_child_set']
        self.assertTrue(group_child_set!=None)
        self.assertEqual(len(group_child_set),2)

        group_child_1 = group_child_set[0]
        sp_1 = group_child_1['store_product']
        self.assertEqual(sp_1['store_id'],store.id)
        self.assertEqual(sp_1['price'],str(old_price))
        self.assertEqual(sp_1['crv'],str(crv))
        self.assertEqual(sp_1['is_taxable'],boolean.get_boolean_from_str(is_taxable))    
        self.assertEqual(sp_1['is_sale_report'],boolean.get_boolean_from_str(is_sale_report))      
        self.assertEqual(sp_1['p_type'],p_type)
        self.assertEqual(sp_1['p_tag'],p_tag)
        self.assertEqual(sp_1['cost'],str(cost))
        self.assertEqual(sp_1['vendor'],vendor)
        self.assertEqual(sp_1['buydown'],str(buydown))

        group_child_2 = group_child_set[1]
        sp_2 = group_child_2['store_product']
        self.assertEqual(sp_2['store_id'],store.id)
        self.assertEqual(sp_2['price'],str(old_price))
        self.assertEqual(sp_2['crv'],str(crv))
        self.assertEqual(sp_2['is_taxable'],boolean.get_boolean_from_str(is_taxable))    
        self.assertEqual(sp_2['is_sale_report'],boolean.get_boolean_from_str(is_sale_report))       
        self.assertEqual(sp_2['p_type'],p_type)
        self.assertEqual(sp_2['p_tag'],p_tag)
        self.assertEqual(sp_2['cost'],str(cost))
        self.assertEqual(sp_2['vendor'],vendor)
        self.assertEqual(sp_2['buydown'],str(buydown))   


        #assert child in couch
        sp_couch_1 = store_product_couch_getter.exe(product_id = sp1.product.id,store_id=store.id)
        self.assertEqual(sp_couch_1['price'],str(old_price))
        self.assertEqual(sp_couch_1['crv'],str(crv))
        self.assertEqual(sp_couch_1['is_taxable'],boolean.get_boolean_from_str(is_taxable))
        self.assertEqual(sp_couch_1['is_sale_report'],boolean.get_boolean_from_str(is_sale_report))
        self.assertEqual(sp_couch_1['p_type'],p_type)
        self.assertEqual(sp_couch_1['p_tag'],p_tag)
        self.assertEqual(sp_couch_1['cost'],str(cost))
        self.assertEqual(sp_couch_1['vendor'],vendor)
        self.assertEqual(sp_couch_1['buydown'],str(buydown))

        sp_couch_2 = store_product_couch_getter.exe(product_id = sp2.product.id,store_id=store.id)
        self.assertEqual(sp_couch_2['price'],str(old_price))
        self.assertEqual(sp_couch_2['crv'],str(crv))
        self.assertEqual(sp_couch_2['is_taxable'],boolean.get_boolean_from_str(is_taxable))
        self.assertEqual(sp_couch_2['is_sale_report'],boolean.get_boolean_from_str(is_sale_report))
        self.assertEqual(sp_couch_2['p_type'],p_type)
        self.assertEqual(sp_couch_2['p_tag'],p_tag)
        self.assertEqual(sp_couch_2['cost'],str(cost))
        self.assertEqual(sp_couch_2['vendor'],vendor)
        self.assertEqual(sp_couch_2['buydown'],str(buydown))



