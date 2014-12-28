from django.http import HttpResponse
from report.models import Report
from report import report_serializer
import json
from django.core.serializers.json import DjangoJSONEncoder

def report_remove_angular_view(request):
    cur_login_store = request.session.get('cur_login_store')
    id = request.POST['report_id'] 
    
    report = Report.objects.prefetch_related('sp_lst').get(pk=id,store_id=cur_login_store.id)
    if report.sp_lst.count() != 0:
        return

    report.delete()
    return HttpResponse('')
