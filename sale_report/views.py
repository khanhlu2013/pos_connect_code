from django.views.generic import TemplateView
from django.http import HttpResponse
import datetime
from django.core.serializers.json import DjangoJSONEncoder
from sale_report import report_getter
import json
from couch import couch_util

class report_view(TemplateView):
    template_name = 'sale/report_by_day.html'

    def dispatch(self,request,*args,**kwargs):
        self.cur_login_store = self.request.session.get('cur_login_store')
        return super(report_view,self).dispatch(request,*args,**kwargs)

    def get_context_data(self,**kwargs):
        context = super(report_view,self).get_context_data(**kwargs)
        context['store_id'] = str(self.cur_login_store.id)
        context['couch_server_url'] = couch_util.get_couch_url(self.cur_login_store.api_key_name,self.cur_login_store.api_key_pwrd)
        return context


def get_report_by_day_view(request):
    cur_login_store = request.session.get('cur_login_store')

    from_date_str = request.GET['from_date']
    to_date_str = request.GET['to_date']
    time_zone_offset = int(request.GET['time_zone_offset'])

    from_date = datetime.datetime.strptime(from_date_str, '%m/%d/%Y')
    to_date = datetime.datetime.strptime(to_date_str, '%m/%d/%Y')
    to_date += datetime.timedelta(days=1)
    from_date += datetime.timedelta(hours = time_zone_offset)
    to_date += datetime.timedelta(hours = time_zone_offset)
    
    report_result_dic = report_getter.exe(store_id= cur_login_store.id,from_date=from_date,to_date=to_date)
    return HttpResponse(json.dumps(report_result_dic,cls=DjangoJSONEncoder),mimetype='application/javascript')