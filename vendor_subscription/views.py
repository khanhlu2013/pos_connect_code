from django.views.generic import UpdateView
from django.core.urlresolvers import reverse_lazy
from django.forms import ModelForm
from django.db.models import Q
from store.models import Store
from vendor.models import Vendor

class SubscriptionForm(ModelForm):
    class Meta:
        model = Store
        fields = ['sub_vendors']
        
    def __init__(self,*args,**kwargs):
        super(SubscriptionForm,self).__init__(*args,**kwargs)
        if 'instance' in kwargs:
            my_store = kwargs['instance']
            self.fields['sub_vendors'].queryset = Vendor.objects.filter(Q(is_approved=True)|Q(creator=my_store))
            

class UpdateVendorSubscription_view(UpdateView):
    model = Store
    template_name = 'vendor_subscription/form_vendor_sub.html'
    context_object_name = 'cur_store'
    success_url = reverse_lazy('invoice:index')
    form_class = SubscriptionForm
