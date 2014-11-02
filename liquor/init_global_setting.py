from django.conf import settings
from util import couch_util
import json
from sale_shortcut import shortcut_getter
from mix_match import mix_match_getter
from mix_match.mix_match_serializer import Mix_match_serializer
from payment_type.payment_type_serializer import Payment_type_serializer
from sale_shortcut.sale_shortcut_serializer import Parent_serializer
from payment_type.models import Payment_type
from django.core.serializers.json import DjangoJSONEncoder

def exe(context,cur_login_store):

    pt_lst = Payment_type.objects.filter(store_id=cur_login_store.id)
    mix_match_lst = mix_match_getter.get_mix_match_lst(cur_login_store.id)
    shortcut_lst = shortcut_getter.get_shorcut_lst(cur_login_store.id) 

    context['STORE_ID_'] = cur_login_store.id
    context['TAX_RATE_'] = cur_login_store.tax_rate
    context['COUCH_SERVER_URL_'] = couch_util.get_couch_access_url(store=cur_login_store)
    context['STORE_DB_PREFIX_'] = settings.STORE_DB_PREFIX  
    context['MIX_MATCH_LST_'] = json.dumps(Mix_match_serializer(mix_match_lst,many=True).data,cls=DjangoJSONEncoder)
    context['PAYMENT_TYPE_LST_'] = json.dumps(Payment_type_serializer(pt_lst,many=True).data,cls=DjangoJSONEncoder)
    context['SHORTCUT_LST_'] = json.dumps(Parent_serializer(shortcut_lst,many=True).data,cls=DjangoJSONEncoder)
    context['SHORTCUT_ROW_COUNT_'] = settings.SHORTCUT_ROW_COUNT
    context['SHORTCUT_COLUMN_COUNT_'] = settings.SHORTCUT_COLUMN_COUNT
    context['STORE_PRODUCT_DOCUMENT_TYPE'] = settings.STORE_PRODUCT_DOCUMENT_TYPE
    context['RECEIPT_DOCUMENT_TYPE'] = settings.RECEIPT_DOCUMENT_TYPE