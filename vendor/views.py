from django.views.generic import CreateView
from vendor.models import Vendor
from django.core.urlresolvers import reverse_lazy
from django.forms import ModelForm

class Vendor_form(ModelForm):
    class Meta:
        model = Vendor
        fields = ['name','street','city','state','zip_code']

    def __init__(self,*args,**kwargs):
        self.cur_store = kwargs.pop('cur_login_store')
        super(Vendor_form,self).__init__(*args,**kwargs)
        
    def save(self):
        result = super(Vendor_form,self).save(commit=False)
        result.creator = self.cur_store
        result.save()
        self.cur_store.sub_vendors.add(result)
        return result


class Create_view(CreateView):
    model = Vendor
    template_name = 'vendor/form_vendor.html'
    success_url = reverse_lazy('invoice:index')
    form_class = Vendor_form

    def get_form_kwargs(self):
        kwargs = super(Create_view,self).get_form_kwargs()
        kwargs['cur_login_store'] = self.request.session.get('cur_login_store')
        return kwargs
