from store_product.models import Store_product
from group.group_serializer import serialize_group_lst
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
import json

def sp_group_getter_view(request):
    #init
    product_id = request.GET['product_id']
    cur_login_store = request.session.get('cur_login_store')

    #dao
    sp = Store_product.objects.prefetch_related('group_set').get(product_id=product_id,store_id=cur_login_store.id)
    group_lst = sp.group_set.all();
    
    #response
    group_serialized_lst = serialize_group_lst(group_lst)
    return HttpResponse(json.dumps(group_serialized_lst,cls=DjangoJSONEncoder), mimetype='application/json')
