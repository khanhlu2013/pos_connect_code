from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls import patterns, include, url
import liquor.views 
from django.contrib import admin
from django.utils.functional import curry
from django.views.defaults import server_error
from django.conf import settings
import sale.urls
import sale_shortcut.urls
import tax.urls
import group.urls
import store_product.urls
import mix_match.urls
import sale_report.urls
import receipt.urls

admin.autodiscover()

urlpatterns = patterns('',

    url(r'^$',liquor.views.home_page_view,name='liquor_home'),
    url(r'^admin/', include(admin.site.urls)), 
    url(r'^account/login/$','django.contrib.auth.views.login',{'template_name':'login.html'},name = 'liquor_login_named_url'),
    url(r'^account/logout/$','django.contrib.auth.views.logout_then_login',name = 'liquor_logout_named_url'),
    url(r'^sale/',include(sale.urls,namespace='sale')),
    url(r'^sale_report/',include(sale_report.urls,namespace='sale_report')),
    url(r'^sale_shortcut/',include(sale_shortcut.urls,namespace='sale_shortcut')),
    url(r'^tax/',include(tax.urls,namespace='tax')),
    url(r'^product/',include(store_product.urls,namespace='store_product')),
    url(r'^mix_match/',include(mix_match.urls,namespace='mix_match')),
    url(r'^group/',include(group.urls,namespace='group')),
    url(r'^receipt/',include(receipt.urls,namespace='receipt')),    
)

handler500 = curry(server_error, template_name='500.html')
urlpatterns += staticfiles_urlpatterns()

if not settings.DEBUG:
    urlpatterns += patterns('',
        (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
    )