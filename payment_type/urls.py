from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from payment_type import views

urlpatterns = patterns('',
    url(r'^insert$',login_required(views.payment_type_insert_view)),
    url(r'^update_angular$',login_required(views.payment_type_update_angular_view)),
    url(r'^delete$',login_required(views.payment_type_delete_view)),
    url(r'^get$',login_required(views.payment_type_get_view)),
)