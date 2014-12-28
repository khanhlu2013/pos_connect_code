from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from store_product.api import get_type_tag_lst,insert_new,insert_old,update_group,update_report,update_kit,sp_search,update_sku,update_sp

urlpatterns = patterns('',
    # namespace='store_product'
    url(r'^update_sp_angular$',login_required(update_sp.exe)),

    #CREATE/INSERT
    url(r'^insert_new_sp_angular$',login_required(insert_new.exe)),
    url(r'^sp_insert_old_angular$',login_required(insert_old.exe)),

    #SEARCH
    url(r'^search_by_sku_angular$',login_required(sp_search.search_by_sku_angular)),
    url(r'^search_by_name_angular$',login_required(sp_search.search_by_name_angular)),
    url(r'^search_by_product_id$',login_required(sp_search.search_by_product_id_view)),
    url(r'^search_by_name_sku_angular$',login_required(sp_search.sp_search_by_name_sku_angular_view)),

    #SKU
    url(r'^sku_add_angular$',login_required(update_sku.sku_add_angular_view)),
    url(r'^sku_assoc_delete_angular$',login_required(update_sku.sku_assoc_delete_angular_view)),

    #GROUP
    url(r'^group/update_angular$',login_required(update_group.exe)),

    #REPORT
    url(r'^report/update_angular$',login_required(update_report.exe)),    

    #UPDATE KIT
    url(r'^kit/update_angular$',login_required(update_kit.exe)),

    #LOOKUP TYPE TAG
    url(r'^get_lookup_type_tag$',login_required(get_type_tag_lst.exe)),
)
