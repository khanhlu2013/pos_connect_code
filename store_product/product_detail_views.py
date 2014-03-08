from django.views.generic import DetailView
from django.shortcuts import get_object_or_404

from store_product.models import Store_product

class Detail_view(DetailView):
    model = Store_product
    template_name = 'store_product/detail/detail.html'
    context_object_name = 'store_product'
    
    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = request.session.get('cur_login_store')
        self.pk = kwargs.get('pk')
        get_object_or_404(Store_product,pk=self.pk,business=self.cur_login_store)
        return super(Detail_view,self).dispatch(request,*args,**kwargs)
