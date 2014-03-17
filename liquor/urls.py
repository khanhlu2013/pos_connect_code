from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls import patterns, include, url
import liquor.views 
import sale.urls
import sale_shortcut.urls
import tax.urls
import invoice.urls
import vendor.urls
import vendor_subscription.urls
import store_product.urls
from django.contrib import admin
from django.utils.functional import curry
from django.views.defaults import server_error
from django.conf import settings

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'liquor.views.home', name='home'),
    # url(r'^liquor/', include('liquor.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^$',liquor.views.home_page_view,name='liquor_home'),
    url(r'^sale/',include(sale.urls,namespace='sale')),
    url(r'^sale_shortcut/',include(sale_shortcut.urls,namespace='sale_shortcut')),
    url(r'^tax/',include(tax.urls,namespace='tax')),
    url(r'^product/',include(store_product.urls,namespace='store_product')),
    url(r'^invoice/',include(invoice.urls,namespace="invoice")),
    url(r'^vendor/subscription/',include(vendor_subscription.urls,namespace='vendor_subscription')),
    url(r'^vendor/',include(vendor.urls,namespace='vendor')),
    url(r'^account/login/$','django.contrib.auth.views.login',{'template_name':'login.html'},name = 'liquor_login_named_url'),
    url(r'^account/logout/$','django.contrib.auth.views.logout_then_login',name = 'liquor_logout_named_url'),
    url(r'^admin/', include(admin.site.urls)),
)

handler500 = curry(server_error, template_name='500.html')
urlpatterns += staticfiles_urlpatterns()

if not settings.DEBUG:
    urlpatterns += patterns('',
        (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
    )