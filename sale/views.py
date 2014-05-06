from django.views.generic import TemplateView
from couch import couch_util
import json
from django.core.serializers.json import DjangoJSONEncoder
from sale_shortcut import sale_shortcut_serializer,shortcut_getter
from mix_match import mix_match_getter,mix_match_serializer

class Sale_view(TemplateView):
    template_name = 'sale/index.html'

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
        context['mix_match_lst'] = json.dumps(mix_match_serializer.serialize_mix_match_lst(mix_match_lst),cls=DjangoJSONEncoder)

        return context

  

