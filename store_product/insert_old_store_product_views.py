from django import forms
from django.views.generic import CreateView
from django.shortcuts import get_object_or_404
from django.core.urlresolvers import reverse_lazy

from product.models import ProdSkuAssoc
from store_product.models import Store_product
import insert_old_store_product_cm

class Add_form(forms.ModelForm):
    
    class Meta:
        model = Store_product
        fields = ['name','price','crv','isTaxable','isTaxReport','isSaleReport','p_type','p_tag']
    
    def __init__(self,*args,**kwargs):
        #ARGS
        self.cur_login_store = kwargs.pop('cur_login_store')
        self.prod_sku_assoc = kwargs.pop('prod_sku_assoc')
                
        #SUPER
        super(Add_form,self).__init__(*args,**kwargs)
        
        #LABEL
        self.fields['name'].label = "name"
                
        #PREFILL NAME
        self.fields['name'].initial = self.prod_sku_assoc.product.__unicode__()

        
    def save(self):
        #CREATE PROD_BUS_ASSOC
        store_product = super(Add_form,self).save(commit=False)
        assoc_sku_str = self.prod_sku_assoc.sku.sku

        return insert_old_store_product_cm.exe \
        ( 
             product = self.prod_sku_assoc.product
            ,business_id = self.cur_login_store.id
            ,name = store_product.name
            ,price = store_product.price
            ,crv = store_product.crv
            ,isTaxable = store_product.isTaxable
            ,isTaxReport = store_product.isTaxReport
            ,isSaleReport = store_product.isSaleReport
            ,assoc_sku_str = assoc_sku_str
            ,p_type = store_product.p_type
            ,p_tag = store_product.p_tag
        )
 
class Add_view(CreateView):
    """
        ARGS
            . sku_str
            . product_id
            . cur_login_store
            
        PRE 
            . prod_sku_assoc exist (this mean product and sku exist)
            . prod_bus_assoc not exist for this store
                    
        POST
            . create prod_bus_assoc
            . create prod_sku_assoc__prod_bus_assoc          
            . current store should not be able to add another sku to this product in this interface
        
    """
    
    model = Store_product
    template_name = 'store_product/add_prod_bus_assoc/add_prod_bus_assoc.html'
    form_class = Add_form
    success_url = reverse_lazy('store_product:search_product')
    
    def dispatch(self,request,*args,**kwargs):
        #PREPARE - VALIDATE ARGS
        self.sku_str = kwargs.get('sku_str')
        self.product_id = kwargs.get('product_id')
        self.cur_login_store = request.session.get('cur_login_store')
        
        #PRE CONDITION
        #prod_sku_assoc exist
        self.prod_sku_assoc = get_object_or_404(ProdSkuAssoc,product__id=self.product_id,sku__sku__exact=self.sku_str)
        
        #prod_bus_assoc not exist for this store
        try:
            prod_bus_assoc = Store_product.objects.get(product__id=self.product_id,business__id=self.cur_login_store.id)
            raise Http404
        except Store_product.DoesNotExist:
            pass
        
        return super(Add_view,self).dispatch(request,*args,**kwargs)
    
    def get_form_kwargs(self):
        kwargs = super(Add_view,self).get_form_kwargs()
        kwargs['cur_login_store'] = self.cur_login_store
        kwargs['prod_sku_assoc'] = self.prod_sku_assoc
        return kwargs

