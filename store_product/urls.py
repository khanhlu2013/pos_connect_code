from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from store_product.view import new_sp_insert_view,old_sp_insert_view,sp_update_view,sp_search_view,sp_group_update_view,sp_kit_update_view,get_lookup_type_tag_view,sp_sku_view

urlpatterns = patterns('',
    # namespace='store_product'
    url(r'^update_sp$',login_required(sp_update_view.sp_update_view)),
    url(r'^update_sp_angular$',login_required(sp_update_view.sp_update_angular_view)),

    #CREATE/INSERT
    url(r'^insert_new_sp$',login_required(new_sp_insert_view.new_sp_insert_view)),
    url(r'^insert_new_sp_angular$',login_required(new_sp_insert_view.new_sp_insert_angular_view)),
    url(r'^insert_old_sp$',login_required(old_sp_insert_view.old_sp_insert_view)),
    url(r'^sp_insert_old_angular$',login_required(old_sp_insert_view.sp_insert_old_angular_view)),

    #SEARCH
    url(r'^search_by_sku$',login_required(sp_search_view.sp_search_by_sku_view)),
    url(r'^search_by_sku_angular$',login_required(sp_search_view.search_by_sku_angular)),
    url(r'^search_by_name$',login_required(sp_search_view.sp_search_by_name_view)),
    url(r'^search_by_name_angular$',login_required(sp_search_view.search_by_name_angular)),
    url(r'^search_by_product_id$',login_required(sp_search_view.search_by_product_id_view)),
    url(r'^search_by_name_sku$',login_required(sp_search_view.sp_search_by_name_sku_view)),
    url(r'^search_by_name_sku_angular$',login_required(sp_search_view.sp_search_by_name_sku_angular_view)),
    

    #SKU
    url(r'^sku/add$',login_required(sp_sku_view.add_ajax)),
    url(r'^sku_add_angular$',login_required(sp_sku_view.sku_add_angular_view)),
    url(r'^sku/delete$',login_required(sp_sku_view.delete_ajax)),
    url(r'^sku_assoc_delete_angular$',login_required(sp_sku_view.sku_assoc_delete_angular_view)),

    #GROUP
    url(r'^group/update_angular$',login_required(sp_group_update_view.sp_group_update_angular_view)),

    #UPDATE KIT
    url(r'^kit/update_angular$',login_required(sp_kit_update_view.sp_kit_update_angular_view)),

    #LOOKUP TYPE TAG
    url(r'^get_lookup_type_tag$',login_required(get_lookup_type_tag_view.get_lookup_type_tag_view)),
)
