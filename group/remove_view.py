from django.http import HttpResponse
from group.models import Group
import json


def group_remove_view(request):
    cur_login_store = request.session.get('cur_login_store')
    id = request.POST['id'] 
    group = Group.objects.get(pk=id,store_id=cur_login_store.id)
    group.delete()
    return HttpResponse(json.dumps(True), mimetype='application/json')