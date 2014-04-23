from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from mix_match.models import Mix_match,Mix_match_child
from mix_match import mix_match_getter,mix_match_serializer
import json
from store_product.models import Store_product

class Mix_match_view(TemplateView):
    template_name = 'mix_match/mix_match.html'

    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(Mix_match_view,self).dispatch(request,*args,**kwargs)

    def get_context_data(self,**kwargs):
        context = super(Mix_match_view,self).get_context_data(**kwargs)

        mix_match_lst = mix_match_getter.get_mix_match_lst(self.cur_login_store.id)
        mix_match_serialized_lst = mix_match_serializer.serialize_mix_match_lst(mix_match_lst)

        context['mix_match_lst'] = json.dumps(mix_match_serialized_lst,cls=DjangoJSONEncoder)
        return context

def mix_match_update_view(request):
    print(request.POST)
    
    if request.POST.has_key('id') and request.POST.has_key('name') and request.POST.has_key('qty') and request.POST.has_key('unit_discount') and request.POST.has_key('pid_comma_separated_lst_str'):
        cur_login_store = request.session.get('cur_login_store')
        id = request.POST['id'] 
        name = request.POST['name'] 
        qty = request.POST['qty'] 
        unit_discount = request.POST['unit_discount'] 
        mix_match_child_pid_lst = request.POST['pid_comma_separated_lst_str'].split(",")

        #validate child is not emtpy
        if len(mix_match_child_pid_lst) == 0:
            return

        #validate parent id 
        parent = mix_match_getter.get_mix_match_item(id=id)
        if parent.store.id != cur_login_store.id:
            return

        #validate child belong store product of this store
        sp_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=mix_match_child_pid_lst)
        if len(sp_lst) != len(mix_match_child_pid_lst):
            return

        #update parent
        parent.name = name
        parent.qty = qty
        parent.utni_discount = unit_discount
        parent.save()

        #update child
        parent.mix_match_child_set.all().delete()
        child_lst = []
        for sp in sp_lst:
            child_lst.append(Mix_match_child(parent_id=parent.id,store_product_id=sp.id))

        Mix_match_child.objects.bulk_create(child_lst)

        #response
        parent = mix_match_getter.get_mix_match_item(id=parent.id)
        parent_serialized = mix_match_serializer.serialize_mix_match_lst([parent,])[0]

        return HttpResponse(json.dumps(parent_serialized,cls=DjangoJSONEncoder), mimetype='application/json')  

def mix_match_insert_view(request):

    if request.POST.has_key('name') and request.POST.has_key('qty') and request.POST.has_key('unit_discount') and request.POST.has_key('pid_comma_separated_lst_str'):
        cur_login_store = request.session.get('cur_login_store')
        name = request.POST['name'] 
        qty = request.POST['qty'] 
        unit_discount = request.POST['unit_discount'] 
        mix_match_child_pid_lst = request.POST['pid_comma_separated_lst_str'].split(",")

        #validate child is not emtpy
        if len(mix_match_child_pid_lst) == 0:
            return

        #validate child belong store product of this store
        sp_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=mix_match_child_pid_lst)
        if len(sp_lst) != len(mix_match_child_pid_lst):
            return

        #create parent
        parent = Mix_match.objects.create(store_id=cur_login_store.id,name=name,qty=qty,unit_discount=unit_discount)
        
        #create child
        child_lst = []
        for sp in sp_lst:
            child_lst.append(Mix_match_child(parent_id=parent.id,store_product_id=sp.id))
        Mix_match_child.objects.bulk_create(child_lst)

        #response
        parent = mix_match_getter.get_mix_match_item(id=parent.id)
        parent_serialized = mix_match_serializer.serialize_mix_match_lst([parent,])[0]

        return HttpResponse(json.dumps(parent_serialized,cls=DjangoJSONEncoder), mimetype='application/json')    


