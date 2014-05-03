from django.views.generic import TemplateView
from django.http import HttpResponse
from product.models import Product
import json
from couch import couch_util
from store_product import sp_serializer
from django.core.serializers.json import DjangoJSONEncoder
from store_product.sp_master_util import get_lookup_type_tag

class sp_search_index_view(TemplateView):
    template_name = 'store_product/product/product.html'
    
    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(sp_search_index_view,self).dispatch(request,*args,**kwargs)
    
    def get_context_data(self,**kwargs):
        context = super(sp_search_index_view,self).get_context_data(**kwargs)
        context['STORE_ID'] = self.cur_login_store.id #when we search, we search for product which include all other store product info. we need to know our current store to pull our store product info
        context['COUCH_SERVER_URL'] = couch_util.get_couch_url(self.cur_login_store.api_key_name,self.cur_login_store.api_key_pwrd) #when search for sku, and product is not found, we will create product and sycn to pouch if nessesary when current local data exist in browser. when sync, we need couch_url
        return context


def is_store_prod_sku_in_lst(prod_lst,store_id,sku_str):
    """
        this is an optimization to calculate if we need to include lookup type tag in sku search.
    """
    result = False;

    for prod in prod_lst:
        prodskuassoc = prod.prodskuassoc_set.get(sku__sku=sku_str)
        if store_id in [sp.store.id for sp in prodskuassoc.store_product_set.all()]:
            result = True;
            break;

    return result;


def sp_search_by_name_view(request):
    name_str = request.GET['name_str']
    cur_login_store = request.session.get('cur_login_store')
    prod_lst = list(Product.objects.filter(store_set__id = cur_login_store.id, store_product__name__icontains=name_str).prefetch_related('store_product_set'))  
    
    data = {
         'prod_lst' : sp_serializer.serialize_product_lst(prod_lst)
    }

    return HttpResponse(json.dumps(data,cls=DjangoJSONEncoder),content_type='application/json')


def sp_search_by_sku_view(request):
    sku_str = request.GET['sku_str']
    cur_login_store = request.session.get('cur_login_store')
    prod_lst = list(Product.objects.filter(sku_set__sku=sku_str).prefetch_related('store_product_set','prodskuassoc_set__store_product_set'))  

    lookup_type_tag = None
    if not is_store_prod_sku_in_lst(prod_lst,cur_login_store.id,sku_str):
        lookup_type_tag = get_lookup_type_tag(cur_login_store.id)

    data = {
         'prod_lst' : sp_serializer.serialize_product_lst(prod_lst)
        ,'lookup_type_tag' : lookup_type_tag
    }

    return HttpResponse(json.dumps(data,cls=DjangoJSONEncoder),content_type='application/json')


def sp_search_by_pid_view(request):
    """
        there are 2 places in client that we need to search sp by id:
            . to update product: we need to include lookup type tag as suggestion
            . to manage sku: we don't need to include lookup type tag
    """

    store_id = request.session.get('cur_login_store').id
    product_id = request.GET['product_id']
    is_include_other_store = request.GET['is_include_other_store']
    is_include_lookup_type_tag = request.GET['is_include_lookup_type_tag']

    product_serialized = sp_serializer.serialize_product_from_id(
         product_id = product_id
        ,store_id = store_id
        ,is_include_other_store = is_include_other_store
    )

    lookup_type_tag = get_lookup_type_tag(store_id) if is_include_lookup_type_tag else None
    return HttpResponse(json.dumps({'product':product_serialized,'lookup_type_tag':lookup_type_tag},cls=DjangoJSONEncoder),content_type='application/json')

        