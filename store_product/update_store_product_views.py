from django.views.generic import UpdateView
from django.shortcuts import get_object_or_404
from django.core.urlresolvers import reverse_lazy
from django.forms import ModelForm
from product.models import Department
from store_product.models import Store_product
from product.Full_department_name_choice_field import Full_department_name_choice_field
from store_product import update_store_product_cm
from django.http import HttpResponse
import json

#-UPDATE PRIVATE PRODUCT-------------------------------------------------------------
class MyForm(ModelForm):
    class Meta:
        model = Store_product
        fields = ['name','price','crv','department','isTaxable','isTaxReport','isSaleReport']
    
    def __init__(self,*args,**kwargs):
        #ARGS
        self.cur_login_store = kwargs.pop('cur_login_store')
        
        #SUPER
        super(MyForm,self).__init__(*args,**kwargs)
        
        #OVERRIDE DEPARTMENT WIDGET
        self.fields['department'] = Full_department_name_choice_field(Department.objects.filter(category__creator=self.cur_login_store),required=False)
        
        #LABEL
        self.fields['name'].label = 'Name'
        
    def save(self):
        prod_bus_assoc = super(MyForm,self).save(commit=False)
        update_store_product_cm.exe( \
             prod_bus_assoc.product.id
            ,prod_bus_assoc.business.id
            ,prod_bus_assoc.name
            ,prod_bus_assoc.price
            ,prod_bus_assoc.crv
            ,prod_bus_assoc.department
            ,prod_bus_assoc.isTaxable
            ,prod_bus_assoc.isTaxReport
            ,prod_bus_assoc.isSaleReport )

        
class Update_view(UpdateView):
    model = Store_product
    template_name = 'store_product/update/update.html'
    context_object_name = 'store_product'   
    form_class = MyForm

    def dispatch(self,request,*args,**kwargs):
        #PREPARE ARGS
        pk = kwargs.get('pk',None)
        cur_login_store = request.session.get('cur_login_store')
        self.obj = get_object_or_404(Store_product,pk=pk,business=cur_login_store)
        return super(Update_view,self).dispatch(request,*args,**kwargs)

    def get_success_url(self):
        return reverse_lazy('store_product:product_detail',kwargs={'pk':self.obj.id})

    def get_object(self):
        return self.obj
    
    def get_form_kwargs(self):
        kwargs = super(Update_view,self).get_form_kwargs()
        kwargs['cur_login_store'] = self.request.session.get('cur_login_store')
        return kwargs


def updator_ajax(request):
    if all(key in request.POST for key in ('product_id','name','price','crv','is_taxable')):
        cur_login_store = request.session.get('cur_login_store')

        product_id_str = request.POST['product_id']
        name = request.POST['name']
        price_str = request.POST['price']
        crv_str = request.POST['crv']
        is_taxable_str = request.POST['is_taxable']
        errmsg = ''

        #validate
        product_id = None
        price = None
        crv = None
        is_taxable = None

        #validate product_id
        try:
            product_id = int(product_id_str)
        except ValueError:
            errmsg += 'product id is not valid'

        #validate name
        if len(name) == 0:
            errmsg += 'Name is emtpy\n'

        #validate price
        try:
            price = float(price_str)
            if price <=0:
                errmsg += 'price is negative'
        except ValueError:
            errmsg += 'price is not valid'

        #validate crv
        if len(crv_str) != 0:
            try:
                crv = float(crv_str)
                if crv < 0:
                    errmsg += 'crv is negative'
            except ValueError:
                errmsg += 'crv is not valid'

        #validate is_taxable
        if is_taxable_str == 'true':
            is_taxable = True
        elif is_taxable_str == 'false':
            is_taxable = False
        else:
            errmsg += 'taxable is not valid'

        try:
            update_store_product_cm.exe( \
                 product_id
                ,cur_login_store.id
                ,name
                ,price
                ,crv
                ,None#prod_bus_assoc.department
                ,is_taxable
                ,None#prod_bus_assoc.isTaxReport
                ,None#prod_bus_assoc.isSaleReport 
            )
        except Exception,e:
            errmsg = "error: " + str(e)

        return HttpResponse(json.dumps({'error':errmsg}),mimetype='application/javascript')
            








