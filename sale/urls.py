from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from sale import views

urlpatterns = patterns('',
	url(r'^index/$',login_required(views.Sale_view.as_view()),name='index'),
	url(r'^report_by_day/$',login_required(views.Sale_report_by_day.as_view()),name='report_by_day'),
	url(r'^get_report_by_day$',login_required(views.get_report_by_day_view)),
)