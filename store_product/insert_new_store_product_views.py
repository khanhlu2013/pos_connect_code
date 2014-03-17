from django.views.generic import TemplateView,ListView,CreateView,UpdateView
from django import forms
from django.core.urlresolvers import reverse_lazy
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.db.models import Q
from product.models import Product,Sku,ProdSkuAssoc
from store_product.models import Store_product
from store_product import insert_new_store_product_cm
from util.forms import StripCharField

#-CREATE PRODUCT--------------------------------------------------------------------


        
class Add_product_form(forms.ModelForm):
    sku_field = StripCharField()
        
    class Meta:
        model = Store_product
        fields = ['name','price','crv','isTaxable','isTaxReport','isSaleReport']
        
    def __init__(self,*args,**kwargs):
        #ARGS
        self.cur_login_store = kwargs.pop('cur_login_store')
        self.pre_fill_sku = kwargs.pop('pre_fill_sku')
        
        #SUPER
        super(Add_product_form,self).__init__(*args,**kwargs)
        
        #LABEL
        self.fields['name'].label = "name"
        self.fields['sku_field'].label = "sku"
        
        #PRE-FILL SKU WIDGET
        self.fields['sku_field'].initial = self.pre_fill_sku
        
       
    def save(self):
        #-CREATE PRODUCT
        store_product = super(Add_product_form,self).save(commit=False)
        sku_str = self.cleaned_data.get('sku_field',None)
        return insert_new_store_product_cm.exe(
             name = store_product.name
            ,price = store_product.price
            ,crv = store_product.crv
            ,isTaxable = store_product.isTaxable
            ,isTaxReport = store_product.isTaxReport
            ,isSaleReport = store_product.isSaleReport
            ,business_id = self.cur_login_store.id
            ,sku_str = sku_str)
 

class Add_product_view(CreateView):
    """
        PRE 
            .none
            
        POST 
            . create product        
            . create prod_bus_assoc       
            . if sku is provided
                . create/get sku                            
                . create prod_sku_assoc 
                . create prod_sku_assoc__prod_bus_assoc                     
                               
                                        
        ARGS
            . cur_login_store       required
            . pre_fill_sku          optional
    """
    
    model = Store_product
    template_name = 'store_product/add_product/add_product.html'
    form_class = Add_product_form
    success_url = reverse_lazy('store_product:search_product')
        
    def get_form_kwargs(self):
        kwargs = super(Add_product_view,self).get_form_kwargs()
        kwargs['cur_login_store'] = self.request.session.get('cur_login_store')
        kwargs['pre_fill_sku'] = self.kwargs.get('pre_fill_sku',None)
        return kwargs
