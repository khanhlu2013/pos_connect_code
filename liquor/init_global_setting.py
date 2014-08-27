from django.conf import settings
from couch import couch_util
import json
from django.core.serializers.json import DjangoJSONEncoder
#dao
from sale_shortcut import shortcut_getter
from mix_match import mix_match_getter
#serializer
from mix_match.mix_match_serializer import Mix_match_serializer
from payment_type.payment_type_serializer import Payment_type_serializer
from sale_shortcut.sale_shortcut_serializer import Parent_serializer
#model
from payment_type.models import Payment_type

def exe(context,cur_login_store):

    pt_lst = Payment_type.objects.filter(store_id=cur_login_store.id)
    mix_match_lst = mix_match_getter.get_mix_match_lst(cur_login_store.id)
    shortcut_lst = shortcut_getter.get_shorcut_lst(cur_login_store.id) 

    context['STORE_ID_'] = cur_login_store.id
    context['TAX_RATE_'] = cur_login_store.tax_rate
    context['COUCH_SERVER_URL_'] = couch_util.get_couch_url(cur_login_store.api_key_name,cur_login_store.api_key_pwrd)
    context['STORE_DB_PREFIX_'] = settings.STORE_DB_PREFIX  
    context['MIX_MATCH_LST_'] = json.dumps(Mix_match_serializer(mix_match_lst,many=True).data,cls=DjangoJSONEncoder)
    context['PAYMENT_TYPE_LST_'] = json.dumps(Payment_type_serializer(pt_lst,many=True).data,cls=DjangoJSONEncoder)
    context['SHORTCUT_LST_'] = json.dumps(Parent_serializer(shortcut_lst,many=True).data,cls=DjangoJSONEncoder)
    context['SHORTCUT_ROW_COUNT_'] = settings.SHORTCUT_ROW_COUNT
    context['SHORTCUT_COLUMN_COUNT_'] = settings.SHORTCUT_COLUMN_COUNT
