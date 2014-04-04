from django.views.generic import UpdateView,DetailView
from django.core.urlresolvers import reverse_lazy
from django.forms import ModelForm
from store.models import Store
from store import update_store_cm

class Form(ModelForm):
    class Meta:
        model = Store
        fields = ['tax_rate']
    
    def save(self):
        store = super(Form,self).save(commit=False)
        update_store_cm.exe(store)


class Update_view(UpdateView):
    model = Store
    template_name = 'tax/update.html'
    context_object_name = 'store'   
    form_class = Form

    def dispatch(self,request,*args,**kwargs):
        #PREPARE ARGS
        pk = kwargs.get('pk',None)
        self.cur_login_store = request.session.get('cur_login_store')
        assert(pk==str(self.cur_login_store.id))
        return super(Update_view,self).dispatch(request,*args,**kwargs)

    def get_success_url(self):
        return reverse_lazy('tax:detail',kwargs={'pk':self.cur_login_store.id})

    def get_context_data(self,**kwargs):
        context = super(Update_view,self).get_context_data(**kwargs)
        context['cur_login_store'] = self.cur_login_store
        return context


class Detail_view(DetailView):
    model = Store
    template_name = 'tax/detail.html'
    context_object_name = 'store'

    def dispatch(self,request,*args,**kwargs):
        #PREPARE ARGS
        pk = kwargs.get('pk',None)
        cur_login_store = request.session.get('cur_login_store')
        assert(pk==str(cur_login_store.id))
        return super(Detail_view,self).dispatch(request,*args,**kwargs)