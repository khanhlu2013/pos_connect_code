from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from group.models import serialize_group_lst
from group import group_getter
import json

def get_lst_view(request):
    cur_login_store = request.session.get('cur_login_store')
    group_lst = group_getter.get_group_lst(cur_login_store.id)
    group_serialized_lst = serialize_group_lst(group_lst)

    return HttpResponse(json.dumps(group_serialized_lst,cls=DjangoJSONEncoder), mimetype='application/json')