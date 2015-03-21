from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from group.group_serializer import Group_sp_lst_serializer
from group import dao
import json
from store_product.models import Store_product
from store_product import dao_couch
from util import couch_db_util

def exe(request):
    cur_login_store = request.session.get('cur_login_store')

    group_id = request.POST['group_id']
    option = json.loads(request.POST['option'])
    if len(option) == 0:
        return

    #validate group id 
    group = dao.get_group_item(id=group_id,store_id=cur_login_store.id)

    #validate group is not empty
    pid_lst = [item.product.id for item in group.sp_lst.all()]
    if len(pid_lst) == 0:
        return

    #update    
    row = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=pid_lst).update(**option)    
    update_couch(pid_lst,cur_login_store, option)
    group = dao.get_group_item(id=group_id,store_id=cur_login_store.id)
    group_serialized = Group_sp_lst_serializer(group).data
    return HttpResponse(json.dumps(group_serialized,cls=DjangoJSONEncoder), mimetype='application/json')


def update_couch(pid_lst,store,option):
    sp_lst = dao_couch.get_lst(pid_lst,store.id)

    for sp in sp_lst:
        if 'price' in option: sp['price'] = str(option['price'])
        if 'crv' in option: sp['crv'] = str(option['crv'])
        if 'is_taxable' in option: sp['is_taxable'] = option['is_taxable']
        if 'is_sale_report' in option: sp['is_sale_report'] = option['is_sale_report']
        if 'p_type' in option: sp['p_type'] = option['p_type']
        if 'p_tag' in option: sp['p_tag'] = option['p_tag']
        if 'vendor' in option: sp['vendor'] = option['vendor']
        if 'cost' in option: sp['cost'] = str(option['cost'])
        if 'buydown' in option: sp['buydown'] = str(option['buydown'])
        if 'value_customer_price' in option: sp['value_customer_price'] = str(option['buydown'])

    db = couch_db_util.get_store_db(store.id)
    db.update(sp_lst)




