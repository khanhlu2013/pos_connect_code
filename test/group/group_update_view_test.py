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
        #foreman  run -e .env,test.env python manage.py test test.group.group_update_view_test:test.update_parent_and_add_child_test       

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

        #create group parent
        group_name = 'marboro group'
        group = mommy.make('group.Group',store=store,name='x')

        
        #MAKE REQUEST
        res = self.app.post(
             '/group/update'
            ,{
                 'id':group.id
                ,'name':group_name
                ,'pid_comma_separated_lst_str':str(sp.product.id)
            }
            ,user=user)

        self.assertEqual(res.status_int,200)
        
        #asert context
        group = res.json
        self.assertTrue(group!=None)

        self.assertEqual(group['name'],group_name)
        group_child_set = group['group_child_set']
        self.assertTrue(group_child_set!=None)
        self.assertEqual(len(group_child_set),1)
        group_child = group_child_set[0]
        #assert group child sp
        group_child_sp = group_child['store_product']
        self.assertEqual(group_child_sp['product_id'],sp.product.id)


    def remove_child_not_empty_test(self):
        #foreman  run -e .env,test.env python manage.py test test.group.group_update_view_test:test.remove_child_not_empty_test       

        user,store = test_helper.create_user_then_store()
        sp1 = new_sp_inserter.exe( \
             store_id = store.id            
            ,name = "Product 1"
            ,price = 1
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
            ,price = 1
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
        
        #MAKE REQUEST
        res = self.app.post(
             '/group/update'
            ,{
                 'id':group.id
                ,'name':'x'
                ,'pid_comma_separated_lst_str':str(sp1.product.id)
            }
            ,user=user)

        self.assertEqual(res.status_int,200)
        
        #asert context
        group = res.json
        self.assertTrue(group!=None)

        #assert group child
        group_child_set = group['group_child_set']
        self.assertTrue(group_child_set!=None)
        self.assertEqual(len(group_child_set),1)
        group_child = group_child_set[0]
        #assert group child sp
        group_child_sp = group_child['store_product']
        self.assertEqual(group_child_sp['product_id'],sp1.product.id)


    def remove_child_empty_test(self):
        #foreman  run -e .env,test.env python manage.py test test.group.group_update_view_test:test.remove_child_empty_test       

        user,store = test_helper.create_user_then_store()
        sp1 = new_sp_inserter.exe( \
             store_id = store.id            
            ,name = "Product 1"
            ,price = 1
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

        group = mommy.make('group.Group',store=store,name='x')
        mommy.make('group.Group_child',group=group,store_product=sp1)
        
        pid_comma_separated_lst_str = ''
        #MAKE REQUEST
        res = self.app.post(
             '/group/update'
            ,{
                 'id':group.id
                ,'name':'x'
                ,'pid_comma_separated_lst_str':pid_comma_separated_lst_str
            }
            ,user=user)

        self.assertEqual(res.status_int,200)
        
        #asert context
        group = res.json
        self.assertTrue(group!=None)

        #assert group child
        group_child_set = group['group_child_set']
        self.assertEqual(len(group_child_set),0)
        