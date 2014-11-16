from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from receipt.api import search,push,adjust_receipt_tender

urlpatterns = patterns('',
    url(r'^get_receipt_pagination$',login_required(search.get_receipt_pagination)),
    url(r'^get_receipt_by_range$',login_required(search.get_receipt_by_range)),
    url(r'^get_receipt_by_count$',login_required(search.get_receipt_by_count)),
    url(r'^get_item$',login_required(search.get_item)),
    url(r'^get_item_base_on_doc_id$',login_required(search.get_item_base_on_doc_id)),
    url(r'^adjust_receipt_tender$',login_required(adjust_receipt_tender.exe)),

    url(r'^push$',login_required(push.exe)),
)