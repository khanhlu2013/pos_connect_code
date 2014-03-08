from django.conf.urls import (patterns,url)
from django.contrib.auth.decorators import login_required
from invoice import views

urlpatterns = patterns('',
               url(r'^$',login_required(views.Index_view.as_view()),name="index"),
               url(r'^create/$',login_required(views.Create_view.as_view()),name="create"),
               url(r'^edit/(?P<pk>\d+)/$',login_required(views.Edit_view.as_view()),name="edit"),
               )