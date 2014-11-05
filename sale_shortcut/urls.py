from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from sale_shortcut import api

urlpatterns = patterns('',
    url(r'^set_parent_name$',login_required(api.set_parent_name_view)),
    url(r'^set_child_info$',login_required(api.set_child_info_view)),
    url(r'^parent_update_angular$',login_required(api.edit_parent_angular_view)),
 	url(r'^parent_create_angular$',login_required(api.create_parent_angular_view)),
    url(r'^delete_child$',login_required(api.delete_child_view)),    
    url(r'^get$',login_required(api.get_view)),
)