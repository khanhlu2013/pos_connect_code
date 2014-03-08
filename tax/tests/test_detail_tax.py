from django_webtest import WebTest
from django.core.urlresolvers import reverse
from helper import test_helper

class Test(WebTest):
    def test(self):
        #coverage run manage.py test --settings=settings.test tax.tests.test_detail_tax:Test.test
        #SETUP COUCHDB-----------------------------------------------------
        test_helper.setup_test_couchdb()

        #FIXTURE-----------------------------------------------------------
        #user and store
        user,bus = test_helper.create_user_then_store()

        #MAKING REQUEST----------------------------------------------------
        res = self.app.\
        get(
            reverse('tax:detail',kwargs={'pk':bus.id}),
            user = user#authenticate
        )
        self.assertEqual(res.status_int,200)

        #TEARDOWN COUCHDB TEST
        test_helper.teardown_test_couchdb()