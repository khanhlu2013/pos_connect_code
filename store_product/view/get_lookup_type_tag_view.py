from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from store_product.sp_master_util import get_lookup_type_tag
import json

def get_lookup_type_tag_view(request):
    store_id = request.session.get('cur_login_store').id
    lookup_type_tag = get_lookup_type_tag(store_id)

    return HttpResponse(json.dumps(lookup_type_tag,cls=DjangoJSONEncoder),content_type='application/json')