from django.views.generic import CreateView
from django.forms import ModelForm
from django.core.urlresolvers import reverse_lazy
from django.shortcuts import get_object_or_404
from util.forms import StripCharField
from product.models import ProdSkuAssoc
from store_product.models import Store_product
from store_product import insert_sku_cm

class MyForm(ModelForm):
    sku_field = StripCharField()
    class Meta:
        model = ProdSkuAssoc
        fields = []

    def __init__(self,*args,**kwargs):
        self.prod_bus_assoc = kwargs.pop('prod_bus_assoc')
        super(MyForm,self).__init__(*args,**kwargs)
        
        #LABEL
        self.fields['sku_field'].label = 'Add sku'
    
    def clean(self):
        #SUPER
        cleaned_data = super(MyForm,self).clean()
        
        #GET DATA
        sku_str = cleaned_data['sku_field']
        
        if not sku_str:
            self._error['sku_str'] = self.error_class(['sku is empty'])
            del cleaned_data['sku_field']
        else:
            try:
                prodSkuAssoc = ProdSkuAssoc.objects.get(sku__sku__exact=sku_str,product__id=self.prod_bus_assoc.product.id)
                self._errors['sku_field'] = self.error_class(['sku existed for this product'])
                del cleaned_data['sku_field']
            except ProdSkuAssoc.DoesNotExist:
                #sku is not exist, it is save 
                pass
        
        return cleaned_data
    
    def save(self):
        prod_sku_assoc = super(MyForm,self).save(commit=False)
        sku_str = self.cleaned_data['sku_field']
        
        #note: clean method already make sure this sku is not exist for this product
        return insert_sku_cm.content_management(
             sku_str = sku_str
            ,product = self.prod_bus_assoc.product
            ,creator = self.prod_bus_assoc.business
            ,prod_bus_assoc = self.prod_bus_assoc
        )        


class Add_prod_sku_assoc_view(CreateView):
    model = ProdSkuAssoc
    template_name = 'store_product/sku/add_sku.html'
    form_class = MyForm
    
    def dispatch(self,request,*args,**kwargs):
        #PREPAIR ARGS
        self.prod_bus_assoc_id = kwargs['prod_bus_assoc_id']
        self.cur_login_store = self.request.session.get('cur_login_store')
        self.prod_bus_assoc = get_object_or_404(Store_product,pk=self.prod_bus_assoc_id,business=self.cur_login_store)
        return super(Add_prod_sku_assoc_view,self).dispatch(request,*args,**kwargs)
    
    def get_success_url(self):
        return reverse_lazy('store_product:add_sku',kwargs={'prod_bus_assoc_id':self.prod_bus_assoc_id})
    
    def get_context_data(self,**kwargs):
        context = super(Add_prod_sku_assoc_view,self).get_context_data(**kwargs)
        #CONSTRUCT CONTEXT
        context['prodskuassoc_lst'] = ProdSkuAssoc.objects.filter(product=self.prod_bus_assoc.product)
        context['prod_bus_assoc'] = self.prod_bus_assoc
        context['prod_bus_assoc_id'] = self.prod_bus_assoc_id
        context['cur_login_store'] = self.cur_login_store
        return context
        
    def get_form_kwargs(self):
        kwargs = super(Add_prod_sku_assoc_view,self).get_form_kwargs()
        kwargs['prod_bus_assoc'] = self.prod_bus_assoc
        return kwargs


    
