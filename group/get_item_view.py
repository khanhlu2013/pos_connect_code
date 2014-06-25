from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from group.group_serializer import serialize_group_item
from group import group_getter
import json

def get_item_view(request):
    cur_login_store = request.session.get('cur_login_store')
    group_id = request.GET['group_id']
    group = group_getter.get_group_item(id=group_id,store_id=cur_login_store.id)
    group_serialized = serialize_group_item(group)

    return HttpResponse(json.dumps(group_serialized,cls=DjangoJSONEncoder), mimetype='application/json')