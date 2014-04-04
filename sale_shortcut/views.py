from sale_shortcut.models import Parent,Child
from django.views.generic import TemplateView
from django.http import HttpResponse
import json
from django.core import serializers
from util.couch import user_util
from django.conf import settings
from couch import couch_util
from product.models import Product


class Index_view(TemplateView):

    template_name = 'sale_shortcut/index.html'

    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(Index_view,self).dispatch(request,*args,**kwargs)

    def get_context_data(self,**kwargs):
        context = super(Index_view,self).get_context_data(**kwargs)
        bus_id = self.cur_login_store.id

        client_user_name = user_util.get_client_user_name(bus_id)
        client_user_password = user_util.get_client_user_password(bus_id)
        couch_server_url = 'http://' + client_user_name + ':' +client_user_password + "@" + settings.COUCHDB_URL
        store_db_name = couch_util._get_store_db_name(bus_id) # 1111 use store_id instead of name
        row_count = 5
        column_count = 3

        context['store_db_name'] = store_db_name
        context['couch_server_url'] = couch_server_url
        context['row_count'] = row_count
        context['column_count'] = column_count
        
        return context


def get_data_view(request):
    cur_login_store = request.session.get('cur_login_store')
    lst_django = Parent.objects.filter(store_id=cur_login_store.id).prefetch_related('child_set')

    return HttpResponse( json.dumps([parent.to_json() for parent in lst_django]), mimetype='application/json' )


def set_parent_name_view(request):
    if request.POST.has_key('name') and request.POST.has_key('position'):
        name = request.POST['name'] 
        position = request.POST['position'] 

        cur_login_store = request.session.get('cur_login_store')
        parent,created = Parent.objects.get_or_create(store_id=cur_login_store.id,position=position)
        parent.caption = name
        parent.save()

        return HttpResponse(json.dumps({'success':True}), mimetype='application/json')


def set_child_info_view(request):
    post = request.POST
    if post.has_key('child_position') and post.has_key('parent_position') and post.has_key('child_caption') and post.has_key('product_id'):
        cur_login_store = request.session.get('cur_login_store')
        parent_position = post['parent_position']
        child_position = post['child_position']
        child_caption = post['child_caption']
        product_id = post['product_id']

        product = Product.objects.get(pk=product_id)

        parent,created_p = Parent.objects.get_or_create(store_id=cur_login_store.id,position=parent_position)
        child,created_c = Child.objects.get_or_create(parent_id=parent.id,position=child_position,defaults={'product_id':product_id,'caption':child_caption})
        
        if not created_c:
            child.caption = child_caption
            child.product = product
            child.save()

        return HttpResponse(json.dumps({'success':True}),mimetype='application/json')






