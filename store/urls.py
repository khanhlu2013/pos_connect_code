from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from store import views

urlpatterns = patterns('',
    url(r'^edit$',login_required(views.edit)),    
)