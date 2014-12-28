from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from report.report_serializer import Report_serializer
from report import dao
import json

def get_lst_view(request):
    cur_login_store = request.session.get('cur_login_store')
    report_lst = dao.get_report_lst(cur_login_store.id)
    report_serialized_lst = Report_serializer(report_lst,many=True).data

    return HttpResponse(json.dumps(report_serialized_lst,cls=DjangoJSONEncoder), mimetype='application/json')