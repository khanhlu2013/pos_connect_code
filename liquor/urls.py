from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.utils.functional import curry
from django.views.defaults import server_error
from django.conf import settings
import sale.urls
import sale_shortcut.urls
import tax.urls
import group.urls
import report.urls
import store_product.urls
import mix_match.urls
import receipt.urls
import payment_type.urls
import product.urls
import store.urls
from store_product import sp_page_view
from django.contrib.auth.decorators import login_required
from test.e2e import protractor_test_cleanup_view
from liquor import global_setting
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$',login_required(sp_page_view.sp_page_view.as_view()),name='sp_search'),   
    url(r'^get_global_setting/$',login_required(global_setting.get_global_setting_api)),   
    url(r'^admin/', include(admin.site.urls)), 
    url(r'^account/login/$','django.contrib.auth.views.login',{'template_name':'login.html'},name = 'liquor_login_named_url'),
    url(r'^account/logout/$','django.contrib.auth.views.logout_then_login',name = 'liquor_logout_named_url'),
    url(r'^sale/',include(sale.urls,namespace='sale')),
    url(r'^sale_shortcut/',include(sale_shortcut.urls,namespace='sale_shortcut')),
    url(r'^tax/',include(tax.urls,namespace='tax')),
    url(r'^store/',include(store.urls,namespace='store')),
    url(r'^sp/',include(store_product.urls,namespace='store_product')),
    url(r'^product/',include(product.urls,namespace='product')),    
    url(r'^mix_match/',include(mix_match.urls,namespace='mix_match')),
    url(r'^group/',include(group.urls,namespace='group')),
    url(r'^report/',include(report.urls,namespace='report')),
    url(r'^receipt/',include(receipt.urls,namespace='receipt')),    
    url(r'^payment_type/',include(payment_type.urls)),        

)

handler500 = curry(server_error, template_name='500.html')

if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^protractor_test_cleanup$',protractor_test_cleanup_view.exe), 
    )

# if settings.DEBUG:
#     import debug_toolbar
#     urlpatterns += patterns('',
#         url(r'^__debug__/', include(debug_toolbar.urls)),
#     )    
  

