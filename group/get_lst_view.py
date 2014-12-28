from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from group.group_serializer import Group_serializer
from group import dao
import json

def get_lst_view(request):
    cur_login_store = request.session.get('cur_login_store')
    group_lst = dao.get_group_lst(cur_login_store.id)
    group_serialized_lst = Group_serializer(group_lst,many=True).data

    return HttpResponse(json.dumps(group_serialized_lst,cls=DjangoJSONEncoder), mimetype='application/json')