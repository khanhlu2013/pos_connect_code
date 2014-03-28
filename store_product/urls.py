from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from store_product import insert_new_store_product_views,product_detail_views,insert_sku_views,delete_sku_views,search_product_views,update_store_product_views
from store_product import insert_old_store_product_views,views

# namespace='store_product'

urlpatterns = patterns('',
    #SEARCH PRODUCT
    url(r'^search/$',login_required(search_product_views.Search_view.as_view()),name='search_product'),
    
    #ADD PRODUCT, SKU IS PREFILL
    url(r'^add/product/sku/(?P<pre_fill_sku>\w+)/$',login_required(insert_new_store_product_views.Add_product_view.as_view()),name='add_product_sku'),
    
    #ADD PRODUCT, SKU IS NOT PREFILL
    url(r'^add/product/$',login_required(insert_new_store_product_views.Add_product_view.as_view()),name='add_product'),
    
    #ASSOCIATE PRODUCT WITH BUSINESS - the reason we need sku_str here is that we want to enforce a condition: association between product and business take place through through searching for sku, not name
    url(r'^add/assoc/(?P<product_id>\d+)/(?P<sku_str>\w+)/$',login_required(insert_old_store_product_views.Add_view.as_view()),name='add_assoc'),
    
    #SHOW DETAIL OF PRODUCT
    url(r'^detail/(?P<pk>\d+)/$',login_required(product_detail_views.Detail_view.as_view()),name='product_detail'),
    
    #UPDATE PRODUCT
    url(r'^update/pk/(?P<pk>\d+)/$',login_required(update_store_product_views.Update_view.as_view()),name='update_product'),
    
    #ADD SKU
    url(r'sku/add/(?P<prod_bus_assoc_id>\d+)/$',login_required(insert_sku_views.Add_prod_sku_assoc_view.as_view()),name='add_sku'),
    
    #DELETE SKU
    url(r'sku/delete/(?P<pk>\d+)/$',login_required(delete_sku_views.Delete_prod_sku_assoc_view.as_view()),name='delete_sku'),

    #AJAX
    url(r'^updator_ajax$',login_required(update_store_product_views.updator_ajax)),
    url(r'^search_product_by_sku_ajax$',login_required(search_product_views.search_product_by_sku_ajax_view)),
    url(r'^sp_creator$',login_required(views.sp_creator_ajax_view)),    
)
