from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from sale import views

urlpatterns = patterns('',
	url(r'^index_angular/$',login_required(views.Sale_angular_view.as_view()),name='index_angular'),
)