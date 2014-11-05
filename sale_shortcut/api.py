from sale_shortcut.models import Parent,Child
from django.http import HttpResponse
import json
from store_product.models import Store_product
from sale_shortcut import sale_shortcut_serializer,shortcut_getter
from django.core.serializers.json import DjangoJSONEncoder

def get_view(request):
    cur_login_store = request.session.get('cur_login_store')
    shortcut_lst = shortcut_getter.get_shorcut_lst(cur_login_store.id)
    lst_serialized = sale_shortcut_serializer.serialize_shortcut_lst(shortcut_lst)
    return HttpResponse(json.dumps(lst_serialized,cls=DjangoJSONEncoder), mimetype='application/json')
    
def create_parent_angular_view(request):
    position = int(request.POST['position']) #if i don't convert this to int(since we don't json.loads here, POST data will be received as string), then eventhough it will create just fine on master db, when we serialized this obj, it return a string position which will cause issue on the client side.
    caption = request.POST['caption']
    cur_login_store = request.session.get('cur_login_store')

    #validate caption
    if caption == None:
        return
    caption = caption.strip()
    if len(caption) == 0:
        return

    #expect parent does not exist
    try:
        Parent.objects.get(store=cur_login_store,position=position)
        return
    except Parent.DoesNotExist:
        pass

    parent = Parent.objects.create(store=cur_login_store,position=position,caption=caption)
    parent_serialized = sale_shortcut_serializer.Parent_serializer(parent).data
    return HttpResponse(json.dumps(parent_serialized,cls=DjangoJSONEncoder),content_type="application/json")


def edit_parent_angular_view(request):
    shortcut_json = json.loads(request.POST['shortcut'])
    cur_login_store = request.session.get('cur_login_store')

    #validate shortcut
    shortcut = Parent.objects.prefetch_related('child_set').get(pk=shortcut_json['id'])
    if shortcut.store.id != cur_login_store.id:
        return
    if shortcut.position != shortcut_json['position']:
        return
    shortcut.caption = shortcut_json['caption']
    shortcut.save()

    shortcut_serialized = sale_shortcut_serializer.Parent_serializer(shortcut).data
    return HttpResponse(json.dumps(shortcut_serialized,cls=DjangoJSONEncoder),content_type="application/json")


def set_parent_name_view(request):
    name = request.POST['name'] 
    position = request.POST['position'] 
    cur_login_store = request.session.get('cur_login_store')
    
    parent,created = Parent.objects.get_or_create(store_id=cur_login_store.id,position=position,defaults={'caption':name})
    if created == False:
        parent.caption = name
        parent.save()

    parent_serialized = sale_shortcut_serializer.serialize_shortcut_lst([parent,])[0]
    return HttpResponse(json.dumps(parent_serialized,cls=DjangoJSONEncoder), mimetype='application/json')


def set_child_info_view(request):
    post_data = json.loads(request.POST['post_data'])
    parent_position = post_data['parent_position']
    child_position = post_data['child_position']
    child_caption = post_data['child_caption']
    product_id = post_data['product_id']
    cur_login_store = request.session.get('cur_login_store')

    store_product = None
    if product_id != None:
        store_product = Store_product.objects.get(product_id=product_id,store_id=cur_login_store.id)

    parent,is_create_parent = Parent.objects.get_or_create(store_id=cur_login_store.id,position=parent_position)
    child,is_create_child = Child.objects.get_or_create(parent_id=parent.id,position=child_position,defaults={'store_product':store_product,'caption':child_caption})
    
    if not is_create_child:
        child.caption = child_caption
        child.store_product = store_product
        child.save()
        parent = shortcut_getter.get_shortcut(parent.id)

    parent_serialized = sale_shortcut_serializer.serialize_shortcut_lst([parent,])[0]            
    return HttpResponse(json.dumps(parent_serialized,cls=DjangoJSONEncoder),mimetype='application/json')


def delete_child_view(request):
    cur_login_store = request.session.get('cur_login_store')
    id = request.POST['id'] 
    child = Child.objects.get(pk=id,parent__store__id=cur_login_store.id)
    child.delete()
    shortcut_lst = shortcut_getter.get_shorcut_lst(cur_login_store.id)
    lst_serialized = sale_shortcut_serializer.serialize_shortcut_lst(shortcut_lst)
    return HttpResponse(json.dumps(lst_serialized,cls=DjangoJSONEncoder), mimetype='application/json')



