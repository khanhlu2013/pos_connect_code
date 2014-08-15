from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from group.group_serializer import serialize_group_lst
from group import group_getter
import json
from store_product.models import Store_product
from util import number,boolean
from store_product.sp_couch import store_product_couch_getter
from couch import couch_util

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
    is_taxable = None if len(is_taxable_raw) == 0 else boolean.get_boolean_from_str(is_taxable_raw)
    is_sale_report = None if len(is_sale_report_raw) == 0 else boolean.get_boolean_from_str(is_sale_report_raw)
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

    if len(update_dic) == 0:
        return #i need to validate this on client side so that no update is not ajax request the server


    #validate group id 
    group = group_getter.get_group_item(id=id_raw,store_id=cur_login_store.id)
    if group.store.id != cur_login_store.id:
        return

    #validate group is not empty
    pid_lst = [item.product.id for item in group.sp_lst.all()]
    if len(pid_lst) == 0:
        return

    #update    
    row = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=pid_lst).update(**update_dic)    
    update_couch(pid_lst,cur_login_store.id, update_dic)

    #response
    group_lst = group_getter.get_group_lst(cur_login_store.id)
    group_serialized_lst = serialize_group_lst(group_lst)   
    response = {'row_update':row,'group_lst':group_serialized_lst}
    return HttpResponse(json.dumps(response,cls=DjangoJSONEncoder), mimetype='application/json')     


def update_couch(pid_lst,store_id,update_dic):
    sp_lst = store_product_couch_getter.get_lst(pid_lst,store_id)

    for sp in sp_lst:
        
        if 'price' in update_dic: sp['price'] = str(update_dic['price'])
        if 'crv' in update_dic: sp['crv'] = str(update_dic['crv'])
        if 'is_taxable' in update_dic: sp['is_taxable'] = update_dic['is_taxable']
        if 'is_sale_report' in update_dic: sp['is_sale_report'] = update_dic['is_sale_report']
        if 'p_type' in update_dic: sp['p_type'] = update_dic['p_type']
        if 'p_tag' in update_dic: sp['p_tag'] = update_dic['p_tag']
        if 'vendor' in update_dic: sp['vendor'] = update_dic['vendor']
        if 'cost' in update_dic: sp['cost'] = str(update_dic['cost'])
        if 'buydown' in update_dic: sp['buydown'] = str(update_dic['buydown'])

    db = couch_util.get_store_db(store_id)
    db.update(sp_lst)




