from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from sale import views

urlpatterns = patterns('',
	url(r'^index_angular/$',login_required(views.Sale_angular_view.as_view()),name='index_angular'),
    url(r'^index_offline_angular/$',login_required(views.Sale_offline_angular_view.as_view()),name='index_offline_angular'),
)