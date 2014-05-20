from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from mix_match import views

urlpatterns = patterns('',
    url(r'^insert$',login_required(views.mix_match_insert_view)),
    url(r'^update$',login_required(views.mix_match_update_view)),
    url(r'^delete$',login_required(views.mix_match_delete_view)),
    url(r'^get$',login_required(views.get_view)),
)