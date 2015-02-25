from django.views.generic import TemplateView
from liquor import global_setting
from django.conf import settings


class product_app_view(TemplateView):
    if settings.IS_USE_CDN:
        template_name = 'dist/deploy/product_app.html'
    else:
        template_name = 'dist/local/product_app.html'

    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(product_app_view,self).dispatch(request,*args,**kwargs)
    
    def get_context_data(self,**kwargs):
        context = super(product_app_view,self).get_context_data(**kwargs)
        global_setting.set(self.cur_login_store,context)
        return context

class Sale_angular_view(TemplateView):
    if settings.IS_USE_CDN:
        template_name = 'dist/deploy/sale_app.html'
    else:
        template_name = 'dist/local/sale_app.html'

    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(Sale_angular_view,self).dispatch(request,*args,**kwargs)

    def get_context_data(self,**kwargs):
        context = super(Sale_angular_view,self).get_context_data(**kwargs)
        global_setting.set(self.cur_login_store,context)
        return context
