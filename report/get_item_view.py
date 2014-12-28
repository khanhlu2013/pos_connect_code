from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from report.report_serializer import Report_sp_lst_serializer
from report import dao
import json

def get_item_view(request):
    cur_login_store = request.session.get('cur_login_store')
    report_id = request.GET['report_id']
    report = dao.get_report_item(id=report_id,store_id=cur_login_store.id)
    report_serialized = Report_sp_lst_serializer(report,many=False).data

    return HttpResponse(json.dumps(report_serialized,cls=DjangoJSONEncoder), mimetype='application/json')