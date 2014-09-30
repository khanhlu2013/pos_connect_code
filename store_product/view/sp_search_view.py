from django.views.generic import TemplateView
from django.http import HttpResponse
from product.models import Product
import json
from store_product import sp_serializer
from django.core.serializers.json import DjangoJSONEncoder
from store_product.sp_master_util import get_lookup_type_tag
from django.db.models import Q
from store_product.models import Store_product
from liquor import init_global_setting

class sp_search_index_angular_view(TemplateView):
    template_name = 'sp_app.html'
    
    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(sp_search_index_angular_view,self).dispatch(request,*args,**kwargs)
    
    def get_context_data(self,**kwargs):
        context = super(sp_search_index_angular_view,self).get_context_data(**kwargs)
        init_global_setting.exe(context,self.cur_login_store);
        return context

def _name_search_qs_alterer_angular(qs,search_str):
    words = search_str.split()

    if len(words) == 1:
        return qs.filter(name__icontains=search_str)
    elif len(words) == 2:
        return qs.extra(where=['store_product_store_product.name ILIKE %s' + ' OR ' + 'store_product_store_product.name ILIKE %s'], params=['%' + words[0] + '%' + words[1] + '%' , '%' + words[1] + '%' + words[0] + '%' ])
    else:
        return None 

def _name_search_qs_alterer(qs,search_str):
    words = search_str.split()

    if len(words) == 1:
        return qs.filter(store_product__name__icontains=search_str)
    elif len(words) == 2:
        return qs.extra(where=['store_product_store_product.name ILIKE %s'], params=['%' + words[0] + '%' + words[1] + '%'])
    else:
        return None 

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
    search_str = request.GET['name_str']
    search_str = search_str.strip()
    if len(search_str) == 0:
        return

    cur_login_store = request.session.get('cur_login_store')
    qs = Product.objects.filter(store_set__id = cur_login_store.id)
    qs = _name_search_qs_alterer(qs,search_str)
    # qs.prefetch_related('store_product_set','prodskuassoc_set__store_product_set') #performance is the same prefetching or not
    prod_lst_serialized = sp_serializer.serialize_product_lst(qs)
    return HttpResponse(json.dumps(prod_lst_serialized,cls=DjangoJSONEncoder),content_type='application/json')

def search_by_product_id_view(request):
    cur_login_store = request.session.get('cur_login_store')
    product_id = request.GET['product_id']
    sp = Store_product.objects.get(store = cur_login_store, product_id=product_id);
    sp_serialized = sp_serializer.Store_product_serializer(sp).data
    return HttpResponse(json.dumps(sp_serialized,cls=DjangoJSONEncoder),content_type='application/json')

def search_by_name_angular(request):
    search_str = request.GET['name_str']
    search_str = search_str.strip()
    if len(search_str) == 0:
        return

    cur_login_store = request.session.get('cur_login_store')
    qs = Store_product.objects.filter(store_id = cur_login_store.id)
    qs = list(_name_search_qs_alterer_angular(qs,search_str))
    sp_lst_serialized = sp_serializer.Store_product_serializer(qs,many=True).data
    return HttpResponse(json.dumps(sp_lst_serialized,cls=DjangoJSONEncoder),content_type='application/json')    


def sp_search_by_sku_view(request):
    sku_str = request.GET['sku_str']
    cur_login_store = request.session.get('cur_login_store')
    qs = Product.objects.filter(sku_set__sku=sku_str).prefetch_related('store_product_set','prodskuassoc_set__store_product_set')
    prod_lst_serialized = sp_serializer.serialize_product_lst(qs)
    return HttpResponse(json.dumps(prod_lst_serialized,cls=DjangoJSONEncoder),content_type='application/json')

def search_by_sku_angular(request):
    """
        INTRO: there are 3 object return from this sku search view
            . prod_store__prod_sku__1_1 : store_product type
            . prod_store__prod_sku__1_0 : store_product type
            . prod_store__prod_sku__0_0 : product type    

        ALGORITHM
            . first i look for 1_1, and if i find it, i stop there since i don't need 1_0 and 0_0 extra data to donwload
            . only if 1_1 is empty then i go look for 1_0 (a list of sp) and 0_0 (a list of p)
    """
    sku_str = request.GET['sku_str'].lower()
    cur_login_store = request.session.get('cur_login_store')

    qs = Store_product.objects.filter(store_id=cur_login_store.id,product__prodskuassoc__sku__sku=sku_str,product__prodskuassoc__store_product_set__store_id=cur_login_store.id)
    prod_store__prod_sku__1_1__serialized = sp_serializer.Store_product_serializer(qs,many=True).data

    response ={}
    response['prod_store__prod_sku__1_1'] = prod_store__prod_sku__1_1__serialized;

    if len(prod_store__prod_sku__1_1__serialized) != 0:
        response['prod_store__prod_sku__0_0'] = [];
        response['prod_store__prod_sku__1_0'] = [];
    else:
        product_lst = list(Product.objects.filter(sku_set__sku=sku_str).prefetch_related('store_product_set','prodskuassoc_set__store_product_set'))
        prod_store__prod_sku__1_0 = []
        prod_store__prod_sku__0_0 = []

        #accumulate 1_0 (sp_lst)
        for product in product_lst:
            for sp in product.store_product_set.all():
                if sp.store.id == cur_login_store.id:
                    prod_store__prod_sku__1_0.append(sp)

        #accumulate 0_0 (p_lst)
        for product in product_lst:
            if cur_login_store.id not in [sp.store.id for sp in product.store_product_set.all()]: #this condition check that this product's store_product_set does not have sp that belong to cur_login_store
                prod_store__prod_sku__0_0.append(product)
                
        response['prod_store__prod_sku__0_0'] = sp_serializer.Product_serializer(prod_store__prod_sku__0_0,many=True).data
        response['prod_store__prod_sku__1_0'] = sp_serializer.Store_product_serializer(prod_store__prod_sku__1_0,many=True).data

    return HttpResponse(json.dumps(response,cls=DjangoJSONEncoder),content_type='application/json')

def sp_search_by_name_sku_view(request):
    search_str = request.GET['search_str']
    search_str = search_str.strip()
    if len(search_str) == 0:
        return

    cur_login_store = request.session.get('cur_login_store')
    qs = Product.objects.filter(store_set__id = cur_login_store.id)
    words = search_str.split()

    if len(words) == 1:
        qs = qs.filter(Q(sku_set__sku__exact=search_str)|Q(store_product__name__icontains=search_str))
    elif len(words) == 2:
        qs = _name_search_qs_alterer(qs=qs,search_str=search_str)
    else:
        return
    qs = qs.distinct() #since we are joining with sku db and if a product have many sku, we could end up with duplicate result. (lets say product with name 'a' have 3 sku, and we search for name 'a' which comeout 3 results)        
    qs = qs.prefetch_related('store_product_set')
    prod_lst_serialized = sp_serializer.serialize_product_lst(qs)
    return HttpResponse(json.dumps(prod_lst_serialized,cls=DjangoJSONEncoder),content_type='application/json')


def sp_search_by_name_sku_angular_view(request):
    search_str = request.GET['search_str']
    search_str = search_str.strip()
    if len(search_str) == 0:
        return

    cur_login_store = request.session.get('cur_login_store')
    qs = Store_product.objects.filter(store = cur_login_store)
    words = search_str.split()

    if len(words) == 1:
        qs = qs.filter(Q(product__sku_set__sku__exact=search_str)|Q(name__icontains=search_str))
    elif len(words) == 2:
        qs = _name_search_qs_alterer_angular(qs=qs,search_str=search_str)
    else:
        return

    qs = qs.distinct() #since we are joining with sku db and if a product have many sku, we could end up with duplicate result. (lets say product with name 'a' have 3 sku, and we search for name 'a' which comeout 3 results)        
    sp_lst_serialized = sp_serializer.Store_product_serializer(qs,many=True).data
    return HttpResponse(json.dumps(sp_lst_serialized,cls=DjangoJSONEncoder),content_type='application/json')

