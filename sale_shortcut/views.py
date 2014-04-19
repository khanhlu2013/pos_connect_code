from sale_shortcut.models import Parent,Child
from django.views.generic import TemplateView
from django.http import HttpResponse
import json
from util.couch import user_util
from django.conf import settings
from couch import couch_util
from store_product.models import Store_product
from sale_shortcut import sale_shortcut_serializer


def get_shortcut(id):
    return Parent.objects.prefetch_related('child_set').get(pk=id)

def get_shorcut_lst(store_id):
    return Parent.objects.filter(store_id=store_id).prefetch_related('child_set')

class Index_view(TemplateView):

    template_name = 'sale_shortcut/index.html'

    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(Index_view,self).dispatch(request,*args,**kwargs)

    def get_context_data(self,**kwargs):
        context = super(Index_view,self).get_context_data(**kwargs)

        row_count = 5
        column_count = 3
        shortcut_lst = get_shorcut_lst(self.cur_login_store.id)
        context['row_count'] = row_count
        context['column_count'] = column_count
        context['shortcut_lst'] = json.dumps(sale_shortcut_serializer.serialize_shortcut_lst(shortcut_lst))

        return context



# def get_data_view(request):
#     cur_login_store = request.session.get('cur_login_store')
#     lst_django = Parent.objects.filter(store_id=cur_login_store.id).prefetch_related('child_set')

#     return HttpResponse( json.dumps([parent.to_json() for parent in lst_django]), mimetype='application/json' )


def set_parent_name_view(request):
    if request.POST.has_key('name') and request.POST.has_key('position'):
        name = request.POST['name'] 
        position = request.POST['position'] 

        cur_login_store = request.session.get('cur_login_store')
        parent,created = Parent.objects.get_or_create(store_id=cur_login_store.id,position=position,defaults={'caption':name})
        if created == False:
            parent.caption = name
            parent.save()

        parent_serialized = sale_shortcut_serializer.serialize_shortcut_lst([parent,])[0]
        return HttpResponse(json.dumps(parent_serialized), mimetype='application/json')


def set_child_info_view(request):
    post = request.POST
    if post.has_key('child_position') and post.has_key('parent_position') and post.has_key('child_caption') and post.has_key('product_id'):
        cur_login_store = request.session.get('cur_login_store')
        parent_position = post['parent_position']
        child_position = post['child_position']
        child_caption = post['child_caption']
        product_id = post['product_id']

        store_product = Store_product.objects.get(product_id=product_id,store_id=cur_login_store.id)

        parent,created_p = Parent.objects.get_or_create(store_id=cur_login_store.id,position=parent_position)
        child,created_c = Child.objects.get_or_create(parent_id=parent.id,position=child_position,defaults={'store_product_id':store_product.id,'caption':child_caption})
        
        if not created_c:
            child.caption = child_caption
            child.store_product = store_product
            child.save()
            parent = get_shortcut(parent.id)

        parent_serialized = sale_shortcut_serializer.serialize_shortcut_lst([parent,])[0]            
        return HttpResponse(json.dumps(parent_serialized),mimetype='application/json')






