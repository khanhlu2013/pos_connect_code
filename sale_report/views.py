from django.http import HttpResponse
import datetime
from django.core.serializers.json import DjangoJSONEncoder
from sale_report import report_getter
import json
from util import boolean

def get_report_by_day_view(request):
    cur_login_store = request.session.get('cur_login_store')

    from_date_str = request.GET['from_date']
    to_date_str = request.GET['to_date']
    time_zone_offset = int(request.GET['time_zone_offset'])
    is_sale_report = boolean.get_boolean_from_str(request.GET['is_sale_report'])

    from_date = datetime.datetime.strptime(from_date_str, '%m/%d/%Y')
    to_date = datetime.datetime.strptime(to_date_str, '%m/%d/%Y')
    to_date += datetime.timedelta(days=1)
    from_date += datetime.timedelta(hours = time_zone_offset)
    to_date += datetime.timedelta(hours = time_zone_offset)
    
    report_result_dic = report_getter.exe(store_id= cur_login_store.id,from_date=from_date,to_date=to_date,is_sale_report = is_sale_report)
    return HttpResponse(json.dumps(report_result_dic,cls=DjangoJSONEncoder),mimetype='application/javascript')