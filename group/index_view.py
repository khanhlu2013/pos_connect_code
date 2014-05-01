from django.views.generic import TemplateView
from django.core.serializers.json import DjangoJSONEncoder
from group.models import serialize_group_lst
from group import group_getter
import json

class Group_view(TemplateView):
    template_name = 'group/group.html'

    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(Group_view,self).dispatch(request,*args,**kwargs)

    def get_context_data(self,**kwargs):
        context = super(Group_view,self).get_context_data(**kwargs)

        group_lst = group_getter.get_group_lst(self.cur_login_store.id)
        group_serialized_lst = serialize_group_lst(group_lst)

        context['group_lst'] = json.dumps(group_serialized_lst,cls=DjangoJSONEncoder)
        return context