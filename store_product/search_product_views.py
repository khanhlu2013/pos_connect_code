from django.views.generic import TemplateView

from product.models import Product

class Search_view(TemplateView):
    template_name = 'store_product/search/search.html'
    
    def dispatch(self,request,*args,**kwargs):
        #GET ARGS-------------------
        self.sku_search = False
        self.name_search = False
        self.sku_error = None
        self.name_error = None
        self.cur_login_store = self.request.session.get('cur_login_store')
        #sku
        sku_str = request.GET.get('sku',None)
        sku_str = sku_str.strip() if sku_str else None
        self.sku_str = sku_str
        #name
        name_str = request.GET.get('name',None)
        name_str = name_str.strip() if name_str else None
        self.name_str = name_str
        
        #VERIFY ARGS----------------
        #INITIAL FORM
        if not self.sku_str and not self.name_str:
            pass
        
        #SKU SEARCH
        elif self.sku_str and not self.name_str:
            if ' ' in self.sku_str : self.sku_error = 'Sku can not contain space'
            else : self.sku_search = True 
        
        #NAME SEARCH
        elif not self.sku_str and self.name_str:
            self.name_search = True
        
        #UNREACHABLE
        elif self.sku_str and self.name_str:
            #this case will not happen
            assert False
            
        #SUPER----------------------
        return super(Search_view,self).dispatch(request,*args,**kwargs)
    
    def get_context_data(self,**kwargs):
        context = super(Search_view,self).get_context_data(**kwargs)
        context['sku_error'] = self.sku_error
        context['name_error'] = self.name_error
        context['sku_str'] = self.sku_str
        context['name_str'] = self.name_str
        context['cur_login_store'] = self.cur_login_store

        search_result = None

        if self.sku_search:
            search_result = list(Product.objects.filter(sku_lst__sku=self.sku_str).prefetch_related('store_product_set','prodskuassoc_set'))
        elif self.name_search:
            search_result = list(Product.objects.filter(bus_lst__id = self.cur_login_store.id,store_product__name__icontains = self.name_str).prefetch_related('store_product_set'))
        else:
            search_result = []

        exist_product_lst  = []
        suggest_product_lst = []

        for item in search_result:
            if item.get_store_product(self.cur_login_store) != None:
                exist_product_lst.append(item)
            else:
                suggest_product_lst.append(item)

        context['exist_product_lst'] = exist_product_lst
        context['suggest_product_lst'] = suggest_product_lst        
        return context


    

