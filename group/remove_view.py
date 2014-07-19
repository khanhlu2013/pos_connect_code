from django.http import HttpResponse
from group.models import Group
from group import group_serializer,group_getter
import json
from django.core.serializers.json import DjangoJSONEncoder

def group_remove_angular_view(request):
    cur_login_store = request.session.get('cur_login_store')
    id = request.POST['group_id'] 
    
    group = Group.objects.prefetch_related('store_product_set').get(pk=id,store_id=cur_login_store.id)
    if group.store_product_set.count() != 0:
    	return

    group.delete()
    return HttpResponse('')


def group_remove_view(request):
    cur_login_store = request.session.get('cur_login_store')
    id = request.POST['id'] 
    group = Group.objects.get(pk=id,store_id=cur_login_store.id)
    group.delete()

    group_lst = group_getter.get_group_lst(store_id=cur_login_store.id)
    group_lst_serialized = group_serializer.serialize_group_lst(group_lst)
    return HttpResponse(json.dumps(group_lst_serialized,cls=DjangoJSONEncoder), mimetype='application/json')