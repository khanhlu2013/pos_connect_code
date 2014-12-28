from django.http import HttpResponse
from group.models import Group
from group import group_serializer
import json
from django.core.serializers.json import DjangoJSONEncoder

def group_remove_angular_view(request):
    cur_login_store = request.session.get('cur_login_store')
    id = request.POST['group_id'] 
    
    group = Group.objects.prefetch_related('sp_lst').get(pk=id,store_id=cur_login_store.id)
    if group.sp_lst.count() != 0:
    	return

    group.delete()
    return HttpResponse('')
