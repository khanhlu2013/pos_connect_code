from django.conf.urls import url,patterns
from django.contrib.auth.decorators import login_required
from vendor_subscription import views
urlpatterns = patterns('',
    url(r'^(?P<pk>\d+)/$',login_required(views.UpdateVendorSubscription_view.as_view()),name='update'),                       

)

