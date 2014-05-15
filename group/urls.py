from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from group import index_view,update_view,insert_view,action_perform_view,get_lst_view

urlpatterns = patterns('',
    url(r'^group/$',login_required(index_view.Group_view.as_view()),name='group'),
    url(r'^get_lst$',login_required(get_lst_view.get_lst_view)),    
    url(r'^insert$',login_required(insert_view.group_insert_view)),
    url(r'^update$',login_required(update_view.group_update_view)),
    url(r'^action$',login_required(action_perform_view.group_action_perform_view)),    
)