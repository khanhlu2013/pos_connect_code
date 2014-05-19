from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from tax import views

urlpatterns = patterns('',
    url(r'^update$',login_required(views.update)),
)