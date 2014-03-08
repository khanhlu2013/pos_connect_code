from django.conf.urls import patterns,url
from django.contrib.auth.decorators import login_required
from product import views

urlpatterns = patterns('',
    url(r'^index/$',login_required(views.DepartmentCreateView.as_view()),name='index'),
    url(r'^category/update/(?P<pk>\d+)$',login_required(views.CategoryUpdateView.as_view()),name='category_update'),
    url(r'^update/(?P<pk>\d+)$',login_required(views.DepartmentUpdateView.as_view()),name='department_update'),
)
