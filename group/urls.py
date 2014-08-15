from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from group import update_view,insert_view,action_perform_view,get_lst_view,remove_view,get_item_view

urlpatterns = patterns('',
    url(r'^get_lst$',login_required(get_lst_view.get_lst_view)),    
    url(r'^get_item$',login_required(get_item_view.get_item_view)),       
    url(r'^insert_angular$',login_required(insert_view.group_insert_angular_view)),    
    url(r'^update_angular$',login_required(update_view.group_update_angular_view)),
    url(r'^delete_angular$',login_required(remove_view.group_remove_angular_view)),    
    url(r'^action$',login_required(action_perform_view.group_action_perform_view)),    
)