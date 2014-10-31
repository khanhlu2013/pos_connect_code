from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from receipt import get_api,push_api

urlpatterns = patterns('',
    url(r'^get_receipt_pagination$',login_required(get_api.get_receipt_pagination)),
    url(r'^get_receipt$',login_required(get_api.get_receipt)),
    url(r'^push$',login_required(push_api.exe)),

)