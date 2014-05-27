from store_product import sp_updator,sp_serializer,store_product_master_getter,sp_kit_updator
from store_product.models import Store_product
from django.http import HttpResponse
import json
from django.core.serializers.json import DjangoJSONEncoder

def sp_kit_update_view(request):
    cur_login_store = request.session.get('cur_login_store')
    product_id = request.POST['product_id'] 
    pid_comma_separated_lst_str = request.POST['pid_comma_separated_lst_str']

    pid_lst = []
    if len(pid_comma_separated_lst_str) != 0:
        pid_lst = pid_comma_separated_lst_str.split(",") 

    sp_lst = []
    if len(pid_lst) != 0:
        sp_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=pid_lst).prefetch_related('kit_child_set')

    #validate child belong store product of this store        
    if len(sp_lst) != len(pid_lst):
        return

    #validate item in sp_lst can not be a kit or is the current product
    for item in sp_lst:
        if item.kit_child_set.count() != 0 or item.product.id == product_id:
            return;

    sp_kit_updator.exe(product_id=product_id,store_id=cur_login_store.id,sp_lst=sp_lst)

    product_serialized = sp_serializer.serialize_product_from_id(product_id=product_id,store_id = cur_login_store.id,is_include_other_store = False)     
    return HttpResponse(json.dumps(product_serialized,cls=DjangoJSONEncoder),content_type='application/json')    