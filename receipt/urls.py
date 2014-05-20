from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from receipt import views

urlpatterns = patterns('',
    url(r'^get_receipt$',login_required(views.get_receipt_view)),
)