from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from sale_shortcut import views

urlpatterns = patterns('',
    url(r'^index/$',login_required(views.Index_view.as_view()),name='index'),
    url(r'^set_parent_name$',login_required(views.set_parent_name_view)),
    url(r'^set_child_info$',login_required(views.set_child_info_view)),

    
)