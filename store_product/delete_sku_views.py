from django.shortcuts import get_object_or_404
from django.core.urlresolvers import reverse_lazy
from django.http import Http404,HttpResponseRedirect
from django.views.generic import CreateView,DeleteView
from product.models import ProdSkuAssoc
from store_product.models import Store_product
from store_product import delete_sku_cm
from product.templatetags import prod_sku_assoc_deletable

class Delete_prod_sku_assoc_view(DeleteView):
    model = ProdSkuAssoc
    template_name = 'store_product/sku/delete_sku.html'
    context_object_name = 'prodskuassoc'
        
    def get_success_url(self):
        return reverse_lazy('store_product:add_sku', kwargs={'prod_bus_assoc_id':self.prod_bus_assoc.id})
        
    def dispatch(self, request, *args, **kwargs):
        self.prod_sku_assoc_id = kwargs['pk']
        self.cur_login_store = request.session.get('cur_login_store')
        self.prod_sku_assoc = get_object_or_404(ProdSkuAssoc,pk=self.prod_sku_assoc_id)
        self.prod_bus_assoc = get_object_or_404(Store_product,product=self.prod_sku_assoc.product,business=self.cur_login_store)
        
        if prod_sku_assoc_deletable.is_prod_sku_assoc_deletable(self.prod_sku_assoc,self.cur_login_store):
            pass
        else:
            raise Exception('Bug: this should not be accessible')
                
        #SUPER
        return super(Delete_prod_sku_assoc_view, self).dispatch(request, *args, **kwargs)
    
    def get_context_data(self,**kwargs):
        context = super(Delete_prod_sku_assoc_view,self).get_context_data(**kwargs)
        context['prod_bus_assoc_id'] = self.prod_bus_assoc.id
        return context

    def delete(self, request, *args, **kwargs):
        prod_sku_assoc = self.get_object()
        delete_sku_cm.content_management(prod_sku_assoc,self.cur_login_store)
        success_url = self.get_success_url()
        return HttpResponseRedirect(success_url)