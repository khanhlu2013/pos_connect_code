from django.views.generic import TemplateView
from django.http import HttpResponse
from product.models import Product
import json
from couch import couch_util
from store_product import sp_master_util,sp_serializer

class Search_view(TemplateView):
    template_name = 'store_product/search/search.html'
    
    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(Search_view,self).dispatch(request,*args,**kwargs)
    
    def get_context_data(self,**kwargs):
        context = super(Search_view,self).get_context_data(**kwargs)
        context['STORE_ID'] = self.cur_login_store.id #when we search, we search for product which include all other store product info. we need to know our current store to pull our store product info
        context['COUCH_SERVER_URL'] = couch_util.get_couch_url(self.cur_login_store.api_key_name,self.cur_login_store.api_key_pwrd) #when search for sku, and product is not found, we will create product and sycn to pouch if nessesary when current local data exist in browser. when sync, we need couch_url
        return context

def serialize_prod_lst(prod_lst):
    return sp_serializer.Product_serializer(prod_lst,many=True).data


def sp_search_by_sku_ajax_view(request):
    if request.method == 'GET':
        cur_login_store = request.session.get('cur_login_store')
        sku_str = request.GET['sku_str']
        product_lst = search_product_by_sku(sku_str)
        exist_product_lst = []
        suggest_product_lst = []

        for item in product_lst:
            if item.get_store_product(cur_login_store) != None:
                exist_product_lst.append(item)
            else:
                suggest_product_lst.append(item)

        lookup_type_tag = None
        if len(exist_product_lst) == 0:
            lookup_type_tag = sp_master_util.get_lookup_type_tag(cur_login_store.id)

        data = {
             'exist_product_lst':serialize_prod_lst(exist_product_lst)
            ,'suggest_product_lst':serialize_prod_lst(suggest_product_lst)
            ,'lookup_type_tag': lookup_type_tag
        }

        return HttpResponse(json.dumps(data),content_type='application/json')


def search_product_by_sku(sku_str):
    """
        DESC:   search all products in the network (all stores) that matched specified sku. 
    """

    return list(Product.objects.filter(sku_lst__sku=sku_str).prefetch_related('store_product_set','prodskuassoc_set__store_product_lst'))    

