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

    def create_non_empty_group_test(self):
        #foreman  run -e .env,test.env python manage.py test test.group.group_insert_view_test:test.create_non_empty_group_test       

        user,store = test_helper.create_user_then_store()
        sp = new_sp_inserter.exe( \
             store_id = store.id            
            ,name = "Jack Daniel"
            ,price = 1
            ,value_customer_price = None
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

        #MAKE REQUEST
        group_name = 'Marborol group'

        res = self.app.post(
             '/group/insert'
            ,{
                 'name':group_name
                ,'pid_comma_separated_lst_str':str(sp.product.id)
            }
            ,user=user)
        self.assertEqual(res.status_int,200)
        

        #asert context
        group = res.json
        self.assertTrue(group!=None)

        self.assertEqual(group['name'],group_name)
        #assert group child
        group_child_set = group['group_child_set']
        self.assertTrue(group_child_set!=None)
        self.assertEqual(len(group_child_set),1)
        group_child = group_child_set[0]
        #assert mm child sp
        group_child_sp = group_child['store_product']
        self.assertEqual(group_child_sp['product_id'],sp.product.id)


    def create_empty_group_test(self):
        #foreman  run -e .env,test.env python manage.py test test.group.group_insert_view_test:test.create_empty_group_test       

        user,store = test_helper.create_user_then_store()

        #MAKE REQUEST
        group_name = 'Marborol group'
        pid_comma_separated_lst_str = ''

        res = self.app.post(
             '/group/insert'
            ,{
                 'name':group_name
                ,'pid_comma_separated_lst_str': pid_comma_separated_lst_str
            }
            ,user=user)
        self.assertEqual(res.status_int,200)
        

        #asert context
        group = res.json
        self.assertTrue(group!=None)

        self.assertEqual(group['name'],group_name)
        #assert group child
        group_child_set = group['group_child_set']
        self.assertEqual(len(group_child_set),0)