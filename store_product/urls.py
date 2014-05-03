from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from store_product import sp_sku_view
from store_product.create_new_sp_for_receipt_ln.views import create_new_sp_for_receipt_ln_view

from store_product.view import new_sp_insert_view,old_sp_insert_view,sp_update_view,sp_search_view


urlpatterns = patterns('',
    # namespace='store_product'
    url(r'^update_sp$',login_required(sp_update_view.sp_update_view)),
    url(r'^insert_new_sp$',login_required(new_sp_insert_view.new_sp_insert_view)),
    url(r'^insert_old_sp$',login_required(old_sp_insert_view.old_sp_insert_view)),

    #SEARCH
    url(r'^search/$',login_required(sp_search_view.sp_search_index_view.as_view()),name='search_product'),    
    url(r'^search_by_sku$',login_required(sp_search_view.sp_search_by_sku_view)),
    url(r'^search_by_name$',login_required(sp_search_view.sp_search_by_name_view)),
    url(r'^search_by_pid$',login_required(sp_search_view.sp_search_by_pid_view)),    

    #SKU
    url(r'^sku/add$',login_required(sp_sku_view.add_ajax)),
    url(r'^sku/delete$',login_required(sp_sku_view.delete_ajax)),

    #AFTER PUSH RECEIPT
    url(r'^create_new_sp_for_receipt_ln$',login_required(create_new_sp_for_receipt_ln_view)),
)
