from sale_shortcut.models import Parent,Child
from django.http import HttpResponse
import json
from store_product.models import Store_product
from sale_shortcut import sale_shortcut_serializer,shortcut_getter


def get_view(request):
    cur_login_store = request.session.get('cur_login_store')
    shortcut_lst = shortcut_getter.get_shorcut_lst(cur_login_store.id)
    lst_serialized = sale_shortcut_serializer.serialize_shortcut_lst(shortcut_lst)
    return HttpResponse(json.dumps(lst_serialized), mimetype='application/json')


def set_parent_name_view(request):
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
    parent_position = request.POST['parent_position']
    child_position = request.POST['child_position']
    child_caption = request.POST['child_caption']
    product_id = request.POST['product_id']
    cur_login_store = request.session.get('cur_login_store')

    store_product = Store_product.objects.get(product_id=product_id,store_id=cur_login_store.id)

    parent,created_p = Parent.objects.get_or_create(store_id=cur_login_store.id,position=parent_position)
    child,created_c = Child.objects.get_or_create(parent_id=parent.id,position=child_position,defaults={'store_product_id':store_product.id,'caption':child_caption})
    
    if not created_c:
        child.caption = child_caption
        child.store_product = store_product
        child.save()
        parent = shortcut_getter.get_shortcut(parent.id)

    parent_serialized = sale_shortcut_serializer.serialize_shortcut_lst([parent,])[0]            
    return HttpResponse(json.dumps(parent_serialized),mimetype='application/json')


def delete_child_view(request):
    cur_login_store = request.session.get('cur_login_store')
    id = request.POST['id'] 
    child = Child.objects.get(pk=id,parent__store__id=cur_login_store.id)
    child.delete()
    return HttpResponse(json.dumps(True), mimetype='application/json')



