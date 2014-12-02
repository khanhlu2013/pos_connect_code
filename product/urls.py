from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from product.api import network_product

urlpatterns = patterns('',
    url(r'^network_product$',login_required(network_product.exe)),
)