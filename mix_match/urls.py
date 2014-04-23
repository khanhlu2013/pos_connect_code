from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from mix_match import views

urlpatterns = patterns('',
    url(r'^mix_match/$',login_required(views.Mix_match_view.as_view()),name='mix_match'),
	url(r'^insert$',login_required(views.mix_match_insert_view)),
)