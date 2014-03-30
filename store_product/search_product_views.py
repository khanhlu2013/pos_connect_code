from django.views.generic import TemplateView
from django.http import HttpResponse
from rest_framework import serializers,fields
from product.models import Product,ProdSkuAssoc
import json
from util.couch import couch_util
from store_product.models import Store_product

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
        context['STORE_ID'] = self.cur_login_store.id
        context['COUCH_SERVER_URL'] = couch_util.get_url(self.cur_login_store.api_key_name,self.cur_login_store.api_key_pwrd)

        search_result = None

        if self.sku_search:
            search_result = search_product_by_sku(self.sku_str)
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

class Prod_sku_assoc_serializer(serializers.ModelSerializer):
    
    sku_str = serializers.Field(source='sku.sku')
    popularity = serializers.Field(source='get_popularity')
    class Meta:
        model = ProdSkuAssoc
        fields = ('sku_str','popularity',)

class Store_product_serializer(serializers.ModelSerializer):
    price = serializers.Field(source='get_price_str')
    product_id = serializers.Field(source='product.id')
    store_id = serializers.Field(source='business.id')

    class Meta:
        model = Store_product
        fields = ('product_id','store_id','name','p_type','p_tag','price','isTaxable')


class Product_serializer(serializers.ModelSerializer):
    name = serializers.Field(source='__unicode__')
    store_product_set = Store_product_serializer(many=True)
    prodskuassoc_set = Prod_sku_assoc_serializer(many=True)
    

    class Meta:
        model = Product
        fields = ('name','id','store_product_set','prodskuassoc_set')


def serialize_prod_lst(prod_lst):
    return Product_serializer(prod_lst,many=True).data

def search_product_by_sku_ajax_view(request):
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

        data = {
             'exist_product_lst':serialize_prod_lst(exist_product_lst)
            ,'suggest_product_lst':serialize_prod_lst(suggest_product_lst)
        } 
        return HttpResponse(json.dumps(data),content_type='application/json')


def search_product_by_sku(sku_str):
    """
        DESC:   search all products in the network (all stores) that matched specified sku. 
    """

    return list(Product.objects.filter(sku_lst__sku=sku_str).prefetch_related('store_product_set','prodskuassoc_set'))    

