from django_webtest import WebTest
from model_mommy import mommy
from sale import report_generator
from sale.models import Receipt
from helper import test_helper

class Test(WebTest):

    # def setUp(self):
    #     test_helper.setup_test_couchdb()

    # def tearDown(self):
    #     test_helper.teardown_test_couchdb()

    # def test(self):
    #     #foreman  run -e .env,test.env python manage.py test test.sale.report_generator_test:Test.test
    #     user,store = test_helper.create_user_then_store()
    #     tax_rate = 1

    #     sp1 = mommy.make('store_product.Store_product',business=store,crv = 1,isTaxable=True,isTaxReport=True,p_type='liquor')

    #     receipt = mommy.make('sale.Receipt',tax_rate=tax_rate,store=store)
    #     ln1 = mommy.make('sale.Receipt_ln',receipt = receipt,qty = 1,store_product = sp1,price = 1,non_product_name=None)

    #     receipt_lst = list(Receipt.objects.all())

    #     report_dic = report_generator.exe(receipt_lst)
        
    #     self.assertEqual(len(report_dic),2) 
    pass