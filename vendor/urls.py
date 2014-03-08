from django.conf.urls import url,patterns
from django.contrib.auth.decorators import login_required
from vendor.views import Create_view

urlpatterns = patterns('',
    url(r'^create/$',login_required(Create_view.as_view()),name='create'),
)