from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from store_product import product_detail_views,insert_sku_views,delete_sku_views,sp_search_view,sp_creator_view,sp_update_view,sp_getter_view

# namespace='store_product'

urlpatterns = patterns('',
    #SEARCH PRODUCT

    
    #SHOW DETAIL OF PRODUCT
    url(r'^detail/(?P<pk>\d+)/$',login_required(product_detail_views.Detail_view.as_view()),name='product_detail'),
    
    #ADD SKU
    url(r'sku/add/(?P<prod_bus_assoc_id>\d+)/$',login_required(insert_sku_views.Add_prod_sku_assoc_view.as_view()),name='add_sku'),
    
    #DELETE SKU
    url(r'sku/delete/(?P<pk>\d+)/$',login_required(delete_sku_views.Delete_prod_sku_assoc_view.as_view()),name='delete_sku'),

    #AJAX
    url(r'^updator_ajax$',login_required(sp_update_view.updator_ajax)),
    url(r'^sp_creator$',login_required(sp_creator_view.sp_creator_ajax_view)),    
    url(r'^getter_ajax$',login_required(sp_getter_view.sp_getter_ajax_view)),    
    
    #AJAX SP SEARCH
    url(r'^search/$',login_required(sp_search_view.Search_view.as_view()),name='search_product'),    
    url(r'^search/sku_ajax$',login_required(sp_search_view.Sku_ajax)),
    url(r'^search/name_ajax$',login_required(sp_search_view.Name_ajax)),

)
