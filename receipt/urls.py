from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from receipt import api,push_processor

urlpatterns = patterns('',
    url(r'^get_receipt_pagination$',login_required(api.get_receipt_pagination)),
    url(r'^get_receipt$',login_required(api.get_receipt)),
    url(r'^push$',login_required(push_processor.exe)),

)