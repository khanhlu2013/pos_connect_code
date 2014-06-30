# from django_webtest import WebTest
# from helper import test_helper
# from store_product.models import Store_product,Kit_breakdown_assoc

# class test(WebTest):   
#     def setUp(self):
#         test_helper.setup_test_couchdb()

#     def tearDown(self):
#         test_helper.teardown_test_couchdb()

#     def test(self):
#         """
#             foreman  run -e .env,test.env python manage.py test test.store_product.sp_kit_update_model_test:test.test

#             DESC: 
#                 . this test cover infinite recursive: 
#                     . kit_sp contains bd_1_sp,bd_2_sp
#                     . bd_1_sp contains kit

#                 . expect exception
#         """        
#         user,store = test_helper.create_user_then_store()

#         #INIT
#         kit_sp = test_helper.insert_new_sp(store.id)
#         bd_1_sp = test_helper.insert_new_sp(store.id)
#         bd_2_sp = test_helper.insert_new_sp(store.id)
#         Kit_breakdown_assoc.objects.create(kit_id=kit_sp.id,breakdown_id=bd_1_sp.id,qty=1)
#         Kit_breakdown_assoc.objects.create(kit_id=kit_sp.id,breakdown_id=bd_2_sp.id,qty=1)

#         #
#         with self.assertRaises(Exception):
#             Kit_breakdown_assoc.objects.create()

#             Kit_breakdown_assoc.exe(kit_id = bd_1_sp.id,store_id=store.id,breakdown_assoc_lst=[assoc,])







