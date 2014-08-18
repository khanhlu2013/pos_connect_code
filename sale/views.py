from django.views.generic import TemplateView
from couch import couch_util
import json
from django.core.serializers.json import DjangoJSONEncoder
from sale_shortcut import sale_shortcut_serializer,shortcut_getter
from sale_shortcut.sale_shortcut_serializer import Parent_serializer
from mix_match import mix_match_getter
from mix_match.mix_match_serializer import Mix_match_serializer
from payment_type import payment_type_serializer
from payment_type.models import Payment_type
from store.models import Store

class Sale_view(TemplateView):
    template_name = 'sale_app_old.html'

    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(Sale_view,self).dispatch(request,*args,**kwargs)

    def get_context_data(self,**kwargs):
        context = super(Sale_view,self).get_context_data(**kwargs)
        store_id = str(self.cur_login_store.id)
        context['store_id'] = store_id
        context['couch_server_url'] = couch_util.get_couch_url(self.cur_login_store.api_key_name,self.cur_login_store.api_key_pwrd)
        context['ROW_COUNT'] = 5        # xxx move this ugly to constance
        context['COLUMN_COUNT'] = 3     # xxx move this ugly to constance
        shortcut_lst = shortcut_getter.get_shorcut_lst(self.cur_login_store.id) 
        context['shortcut_lst'] = json.dumps(sale_shortcut_serializer.serialize_shortcut_lst(shortcut_lst))
        mix_match_lst = mix_match_getter.get_mix_match_lst(self.cur_login_store.id)
        context['mix_match_lst'] = json.dumps(Mix_match_serializer(mix_match_lst,many=True).data,cls=DjangoJSONEncoder)
        context['tax_rate'] = self.cur_login_store.tax_rate

        #payment type
        pt_lst = Payment_type.objects.filter(store_id=self.cur_login_store.id)
        pt_lst_serialized = payment_type_serializer.serialize_payment_type_lst(pt_lst)
        context['payment_type_lst'] = json.dumps(pt_lst_serialized,cls=DjangoJSONEncoder)

        return context


class Sale_angular_view(TemplateView):
    template_name = 'sale_app.html'

    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(Sale_angular_view,self).dispatch(request,*args,**kwargs)

    def get_context_data(self,**kwargs):
        context = super(Sale_angular_view,self).get_context_data(**kwargs)
        store_id = str(self.cur_login_store.id)
        context['store_id'] = store_id
        context['couch_server_url'] = couch_util.get_couch_url(self.cur_login_store.api_key_name,self.cur_login_store.api_key_pwrd)
        context['ROW_COUNT'] = 5        # xxx move this ugly to constance
        context['COLUMN_COUNT'] = 3     # xxx move this ugly to constance
        shortcut_lst = shortcut_getter.get_shorcut_lst(self.cur_login_store.id) 
        context['shortcut_lst'] = json.dumps(Parent_serializer(shortcut_lst,many=True).data,cls=DjangoJSONEncoder)
        mix_match_lst = mix_match_getter.get_mix_match_lst(self.cur_login_store.id)
        context['mix_match_lst'] = json.dumps(Mix_match_serializer(mix_match_lst,many=True).data,cls=DjangoJSONEncoder)
        context['tax_rate'] = self.cur_login_store.tax_rate

        #payment type
        pt_lst = Payment_type.objects.filter(store_id=self.cur_login_store.id)
        pt_lst_serialized = payment_type_serializer.serialize_payment_type_lst(pt_lst)
        context['payment_type_lst'] = json.dumps(pt_lst_serialized,cls=DjangoJSONEncoder)

        return context