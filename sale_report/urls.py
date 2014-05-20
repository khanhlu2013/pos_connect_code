from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from sale_report import views

urlpatterns = patterns('',
	url(r'^date_range$',login_required(views.get_report_by_day_view)),
)