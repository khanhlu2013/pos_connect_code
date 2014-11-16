from django.views.generic import TemplateView
from liquor import global_setting

class Sale_angular_view(TemplateView):
    template_name = 'sale_app.html'

    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(Sale_angular_view,self).dispatch(request,*args,**kwargs)

    def get_context_data(self,**kwargs):
        context = super(Sale_angular_view,self).get_context_data(**kwargs)
        global_setting.set(self.cur_login_store,context)
        return context


class Sale_offline_angular_view(TemplateView):
    template_name = 'sale_app.html'

    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(Sale_offline_angular_view,self).dispatch(request,*args,**kwargs)

    def get_context_data(self,**kwargs):
        context = super(Sale_offline_angular_view,self).get_context_data(**kwargs)
        context['IS_OFFLINE'] = True
        global_setting.set(self.cur_login_store,context)
        return context