from django.views.generic import TemplateView
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from group.models import Group,Group_child,serialize_group_lst
from group import group_getter
import json
from store_product.models import Store_product

class Group_view(TemplateView):
    template_name = 'group/group.html'

    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(Group_view,self).dispatch(request,*args,**kwargs)

    def get_context_data(self,**kwargs):
        context = super(Group_view,self).get_context_data(**kwargs)

        group_lst = group_getter.get_group_lst(self.cur_login_store.id)
        group_serialized_lst = serialize_group_lst(group_lst)

        context['group_lst'] = json.dumps(group_serialized_lst,cls=DjangoJSONEncoder)
        return context


def group_insert_view(request):
    cur_login_store = request.session.get('cur_login_store')
    pid_comma_separated_lst_str = request.POST['pid_comma_separated_lst_str']
    name = request.POST['name']
    
    pid_lst = []
    if len(pid_comma_separated_lst_str) != 0:
        pid_lst = pid_comma_separated_lst_str.split(",")     

    sp_lst = []
    if len(pid_lst) != 0:
        sp_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=pid_lst)

    #validate child belong store product of this store        
    if len(sp_lst) != len(pid_lst):
        return

    #create parent
    parent = Group.objects.create(store_id=cur_login_store.id,name=name)
    
    #create child
    child_lst = []
    for sp in sp_lst:
        child_lst.append(Group_child(group_id=parent.id,store_product_id=sp.id))
    if len(child_lst) != 0:
        Group_child.objects.bulk_create(child_lst)

    #response
    parent = group_getter.get_group_item(id=parent.id)
    parent_serialized = serialize_group_lst([parent,])[0]

    return HttpResponse(json.dumps(parent_serialized,cls=DjangoJSONEncoder), mimetype='application/json')


def group_update_view(request):
    cur_login_store = request.session.get('cur_login_store')
    id = request.POST['id'] 
    name = request.POST['name'] 
    pid_comma_separated_lst_str = request.POST['pid_comma_separated_lst_str']


    pid_lst = []
    if len(pid_comma_separated_lst_str) != 0:
        pid_lst = pid_comma_separated_lst_str.split(",") 

    sp_lst = []
    if len(pid_lst) != 0:
        sp_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=pid_lst)

    #validate child belong store product of this store        
    if len(sp_lst) != len(pid_lst):
        return


    #validate parent id 
    parent = group_getter.get_group_item(id=id)
    if parent.store.id != cur_login_store.id:
        return


    #update parent
    parent.name = name
    parent.save()

    #update child
    parent.group_child_set.all().delete()
    child_lst = []
    for sp in sp_lst:
        child_lst.append(Group_child(group_id=parent.id,store_product_id=sp.id))
    if len(child_lst) != 0:
        Group_child.objects.bulk_create(child_lst)

    #response
    parent = group_getter.get_group_item(id=parent.id)
    parent_serialized = serialize_group_lst([parent,])[0]

    return HttpResponse(json.dumps(parent_serialized,cls=DjangoJSONEncoder), mimetype='application/json')    
  

def group_action_perform_view(request):
    cur_login_store = request.session.get('cur_login_store')

    id_raw = request.POST['id'] 
    price_raw = request.POST['price']
    crv_raw = request.POST['crv']
    is_taxable_raw = request.POST['is_taxable']
    is_sale_report_raw = request.POST['is_sale_report']
    p_type_raw = request.POST['p_type']
    p_tag_raw = request.POST['p_tag']
    vendor_raw = request.POST['vendor']
    cost_raw = request.POST['cost']
    buydown_raw = request.POST['buydown']    

    price = number.get_double_from_str(price_raw)
    crv = number.get_double_from_str(crv_raw)
    is_taxable = boolean.get_boolean_from_str(is_taxable_raw)
    is_sale_report = boolean.get_boolean_from_str(is_sale_report_raw)
    p_type = p_type_raw
    p_tag = p_tag_raw
    vendor = vendor_raw
    cost = number.get_double_from_str(cost_raw)
    buydown = number.get_double_from_str(buydown_raw)


    update_dic = {}
    if price : update_dic['price'] = price
    if crv : update_dic['crv'] = crv
    if is_taxable : update_dic['is_taxable'] = is_taxable
    if is_sale_report : update_dic['is_sale_report'] = is_sale_report
    if p_type : update_dic['p_type'] = p_type
    if p_tag : update_dic['p_tag'] = p_tag        
    if vendor : update_dic['vendor'] = vendor
    if cost : update_dic['cost'] = cost
    if buydown : update_dic['buydown'] = buydown

    if len(update_dic == 0):
        return #i need to validate this on client side so that no update is not ajax request the server


    #validate parent id 
    parent = group_getter.get_group_item(id=id_raw)
    if parent.store.id != cur_login_store.id:
        return

    #validate group is not empty
    pid_lst = [item.store_product.pid for item in parent.group_child_set.all()]
    if len(pid_lst) == 0:
        return

    rows = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=pid_lst).update(update_dic)    
    return HttpResponse(json.dumps(product_serialized,cls=DjangoJSONEncoder),content_type='application/json')    










        

