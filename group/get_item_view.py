from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from group.group_serializer import Group_sp_lst_serializer
from group import dao
import json

def get_item_view(request):
    cur_login_store = request.session.get('cur_login_store')
    group_id = request.GET['group_id']
    group = dao.get_group_item(id=group_id,store_id=cur_login_store.id)
    group_serialized = Group_sp_lst_serializer(group,many=False).data

    return HttpResponse(json.dumps(group_serialized,cls=DjangoJSONEncoder), mimetype='application/json')