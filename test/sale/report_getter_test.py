from django_webtest import WebTest
from model_mommy import mommy
from sale import report_calculator
from sale.models import Receipt,Receipt_ln
from helper import test_helper
from store_product.models import Store_product
from decimal import Decimal

class test(WebTest):

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
		pass: