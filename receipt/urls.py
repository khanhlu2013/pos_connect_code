from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from receipt.api import search,push

urlpatterns = patterns('',
    url(r'^get_receipt_pagination$',login_required(search.get_receipt_pagination)),
    url(r'^get_receipt_by_range$',login_required(search.get_receipt_by_range)),
    url(r'^get_receipt_by_count$',login_required(search.get_receipt_by_count)),
    url(r'^push$',login_required(push.exe)),
)