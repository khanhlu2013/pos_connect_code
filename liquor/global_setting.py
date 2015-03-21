from django.conf import settings
from util import couch_db_util
import json
from sale_shortcut import shortcut_getter
from mix_match import mix_match_getter
from mix_match.mix_match_serializer import Mix_match_serializer
from payment_type.payment_type_serializer import Payment_type_serializer
from sale_shortcut.sale_shortcut_serializer import Parent_serializer
from payment_type.models import Payment_type
from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from store.store_serializer import Store_serializer
from store.models import Store

def _get_global_setting(store):
    pt_lst = Payment_type.objects.filter(store_id=store.id)
    mix_match_lst = mix_match_getter.get_mix_match_lst(store.id)
    shortcut_lst = shortcut_getter.get_shorcut_lst(store.id) 

    res = {}
    res['STORE'] = json.dumps(Store_serializer(store,many=False).data,cls=DjangoJSONEncoder)
    res['STORE_ID'] = store.id
    res['TAX_RATE'] = store.tax_rate
    res['COUCH_SERVER_URL'] = couch_db_util.get_couch_access_url(store=store,is_use_api_key=True)
    res['STORE_DB_PREFIX'] = settings.STORE_DB_PREFIX  
    res['MIX_MATCH_LST'] = json.dumps(Mix_match_serializer(mix_match_lst,many=True).data,cls=DjangoJSONEncoder)
    res['PAYMENT_TYPE_LST'] = json.dumps(Payment_type_serializer(pt_lst,many=True).data,cls=DjangoJSONEncoder)
    res['SHORTCUT_LST'] = json.dumps(Parent_serializer(shortcut_lst,many=True).data,cls=DjangoJSONEncoder)
    res['SHORTCUT_ROW_COUNT'] = settings.SHORTCUT_ROW_COUNT
    res['SHORTCUT_COLUMN_COUNT'] = settings.SHORTCUT_COLUMN_COUNT
    res['STORE_PRODUCT_DOCUMENT_TYPE'] = settings.STORE_PRODUCT_DOCUMENT_TYPE
    res['RECEIPT_DOCUMENT_TYPE'] = settings.RECEIPT_DOCUMENT_TYPE  
    res['VIEW_BY_PRODUCT_ID'] = settings.STORE_DB_VIEW_NAME_BY_PRODUCT_ID
    res['VIEW_BY_SKU'] = settings.STORE_DB_VIEW_NAME_BY_SKU
    res['VIEW_BY_D_TYPE'] = settings.STORE_DB_VIEW_NAME_BY_D_TYPE

    return res;

def set(store,context):
    context.update(_get_global_setting(store))

def get_global_setting_api(request):
    cur_login_store = request.session.get('cur_login_store')
    store = Store.objects.get(pk=cur_login_store.id)
    global_setting = _get_global_setting(store)
    return HttpResponse(json.dumps(global_setting,cls=DjangoJSONEncoder),content_type='application/json')