from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from store_product import dao
import json

def exe(request):
    store_id = request.session.get('cur_login_store').id
    lookup_type_tag = dao.get_type_tag_lst(store_id)

    return HttpResponse(json.dumps(lookup_type_tag,cls=DjangoJSONEncoder),content_type='application/json')