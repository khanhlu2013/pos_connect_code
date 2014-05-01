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
            create a group, and make sure view context include this group with correct json data
        """
        #foreman  run -e .env,test.env python manage.py test test.group.group_index_view_test:test.test       


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

        #create group parent
        group_name = 'marborol group'
        group = mommy.make('group.Group',name=group_name,store=store)
        #create group child
        group_child = mommy.make('group.Group_child',group=group,store_product=sp)


        #MAKE REQUEST
        res = self.app.get(reverse('group:group'), user=user)
        self.assertEqual(res.status_int,200)
        
        #asert context
        group_lst = json.loads(res.context['group_lst'])
        self.assertEqual(len(group_lst),1)
        
        #assert group
        group = group_lst[0]
        self.assertEqual(group['name'],group_name)
        #assert group child
        group_child_set = group['group_child_set']
        self.assertTrue(group_child_set!=None)
        self.assertEqual(len(group_child_set),1)
        group_child = group_child_set[0]
        #assert mm child sp
        group_child_sp = group_child['store_product']
        self.assertEqual(group_child_sp['product_id'],sp.product.id)
        self.assertEqual(group_child_sp['store_id'],store.id)
        self.assertEqual(group_child_sp['name'],product_name)
        self.assertEqual(group_child_sp['price'],str(price))
        self.assertEqual(group_child_sp['crv'],str(crv))
        self.assertEqual(group_child_sp['is_taxable'],is_taxable)    
        self.assertEqual(group_child_sp['is_sale_report'],is_sale_report)      
        self.assertEqual(group_child_sp['p_type'],p_type)
        self.assertEqual(group_child_sp['p_tag'],p_tag)
        self.assertEqual(group_child_sp['cost'],str(cost))
        self.assertEqual(group_child_sp['vendor'],vendor)
        self.assertEqual(group_child_sp['buydown'],str(buydown))
        

