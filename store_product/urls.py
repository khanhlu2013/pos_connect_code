from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from store_product import sp_sku_view,sp_search_view,sp_creator_view,sp_update_view,sp_getter_view
from store_product.create_new_sp_for_receipt_ln.views import create_new_sp_for_receipt_ln_view

# namespace='store_product'

urlpatterns = patterns('',


    url(r'^updator_ajax$',login_required(sp_update_view.updator_ajax)),
    url(r'^sp_creator$',login_required(sp_creator_view.sp_creator_ajax_view)),    
    url(r'^getter_ajax$',login_required(sp_getter_view.sp_getter_ajax_view)),    
    url(r'^create_new_sp_for_receipt_ln$',login_required(create_new_sp_for_receipt_ln_view)),   


    #SEARCH
    url(r'^search/$',login_required(sp_search_view.Search_view.as_view()),name='search_product'),    
    url(r'^search/sku_ajax$',login_required(sp_search_view.Sku_ajax)),
    url(r'^search/name_ajax$',login_required(sp_search_view.Name_ajax)),

    #SKU
    url(r'^sku/add$',login_required(sp_sku_view.add_ajax)),
    url(r'^sku/delete$',login_required(sp_sku_view.delete_ajax)),
)
