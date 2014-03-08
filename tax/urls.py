from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from tax import views

urlpatterns = patterns('',
    url(r'^update/(?P<pk>\d+)$',login_required(views.Update_view.as_view()),name='update'),
    url(r'^detail/(?P<pk>\d+)$',login_required(views.Detail_view.as_view()),name='detail'),
)