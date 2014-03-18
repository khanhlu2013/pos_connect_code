from django_webtest import WebTest
from django.core.urlresolvers import reverse
from helper import test_helper
from tax.couch import tax_util
from store.models import Store

class Test(WebTest):

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        #foreman  run -e .env,test.env python manage.py test tax.tests.test_update_tax:Test.test

        #FIXTURE-----------------------------------------------------------
        #user and store
        user,bus = test_helper.create_user_then_store()

        #MAKING REQUEST----------------------------------------------------
        response = self.app.\
        get(
            reverse('tax:update',kwargs={'pk':bus.id}),
            user = user#authenticate
        )
        self.assertEqual(response.status_int,200)

        #FILL OUT FORM-----------------------------------------------------
        tax_rate = 9.125
        form = response.form
        form['tax_rate'] = tax_rate
        response = form.submit().follow()

        #TEST RESPONSE UI
        self.assertTrue(str(tax_rate) in response.body)

        #TEST MASTER TAX
        bus = Store.objects.get(pk=bus.id)
        self.assertEqual(bus.tax_rate,tax_rate)

        #TEST COUCH
        tax_document = tax_util.get_tax_document(bus.id)
        self.assertTrue(tax_document!=None)
        self.assertEqual(tax_document["tax_rate"],str(tax_rate))

