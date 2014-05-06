from django_webtest import WebTest
from model_mommy import mommy
from helper import test_helper
from decimal import Decimal
import datetime
from sale.models import Receipt,Receipt_ln
from store_product.models import Store_product

class test(WebTest):

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        # foreman  run -e .env,test.env python manage.py test test.sale_report.get_report_view_test:test.test
        user,store = test_helper.create_user_then_store()
        tax_rate = 9.0
        now = datetime.datetime.now()

        #receipt
        r1 = mommy.make(
             Receipt
            ,tax_rate = tax_rate
            ,store = store
            ,time_stamp = now
        )

        #sp
        sp_name           = 'sp_name'
        sp_price          = 2.2
        sp_crv            = 2.2
        sp_is_taxable     = True
        sp_is_sale_report = True
        sp_p_type         = None
        sp_p_tag          = None
        sp = mommy.make(
             Store_product
            ,store              = store
            ,name               = sp_name
            ,price              = sp_price
            ,crv                = sp_crv
            ,is_taxable         = sp_is_taxable
            ,is_sale_report     = sp_is_sale_report
            ,p_type             = sp_p_type
            ,p_tag              = sp_p_tag
        )

        #receipt_ln
        ln_qty               = 2
        ln_price             = 2.2
        ln_crv               = 2.2
        ln_dicount           = None
        ln_non_product_name  = None

        r1_l2 = mommy.make(
             Receipt_ln
            ,receipt            = r1
            ,qty                = ln_qty
            ,store_product      = sp
            ,price              = ln_price
            ,crv                = ln_crv
            ,discount           = ln_dicount
            ,non_product_name   = ln_non_product_name
            ,is_taxable         = sp_is_taxable
            ,p_type             = sp_p_type
            ,p_tag              = sp_p_tag
            ,cost               = None
            ,buydown            = None            
        )        

        date_str = '%s%s%s' % (now.month,now.day,now.year)
        data = {
             'from_date' : date_str
			,'to_date' : date_str
        }
        res = self.app.get(
             '/sale_report/get_report'
            ,data
            ,user=user
        )
        self.assertEqual(res.status_int,200)









