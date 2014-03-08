from django.views.generic import (ListView,CreateView,UpdateView)
from django.http import HttpResponse
from django.core.urlresolvers import reverse_lazy
from django.forms import ModelForm
from invoice.models import Invoice
from store.models import Store
from vendor.models import Vendor

class Index_view(ListView):
    template_name = 'invoice/index_invoice.html'
    context_object_name = 'invoice_list'
    
    def get_queryset(self):
        cur_login_store = self.request.session.get('cur_login_store')
        if cur_login_store:
            return Invoice.objects.filter(to_store = cur_login_store)
        else:
            assert False
            
    def get_context_data(self, **kwargs):
        context = super(Index_view, self).get_context_data(**kwargs)
        context['cur_login_store'] = self.request.session.get('cur_login_store')
        return context
            
class Create_form(ModelForm):
    class Meta:
        model = Invoice
        fields = ('from_vendor','date_invoice','amount')
        
    def __init__(self,*args,**kwargs):
        self.cur_store = kwargs.pop('cur_login_store')
        super(Create_form,self).__init__(*args,**kwargs)
        self.fields['from_vendor'].queryset = self.cur_store.sub_vendors.all()
                
    def save(self):
        result = super(Create_form,self).save(commit=False)
        result.to_store = self.cur_store
        result.save()
        return result
    
        
class Create_view(CreateView):
    model = Invoice
    template_name = 'invoice/form_invoice.html'
    success_url = reverse_lazy('invoice:index')
    form_class = Create_form
    
    def get_form_kwargs(self):
        kwargs = super(Create_view, self).get_form_kwargs()
        kwargs['cur_login_store'] = self.request.session.get('cur_login_store')
        return kwargs

              
class Edit_view(UpdateView):
    model = Invoice
    template_name = 'invoice/form_invoice.html'
    success_url = reverse_lazy('invoice:index')
    