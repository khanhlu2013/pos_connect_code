from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from report.models import Report
from report.report_serializer import Report_serializer
import json
from store_product.models import Store_product

def report_insert_angular_view(request):
    cur_login_store = request.session.get('cur_login_store')
    report_json = json.loads(request.POST['report'])
    
    sp_lst = []
    count_sp_client = len(report_json['sp_lst'])
    if count_sp_client != 0:
        sp_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=[sp['product_id'] for sp in report_json['sp_lst']])
        if count_sp_client != len(sp_lst):
            return

    #create report
    report = Report.objects.create(store_id=cur_login_store.id,name=report_json['name'])
    
    #insert sp
    if len(sp_lst) !=0:
        report.sp_lst.add(*sp_lst)

    #response
    report_serialized = Report_serializer(report,many=False).data
    return HttpResponse(json.dumps(report_serialized,cls=DjangoJSONEncoder), mimetype='application/json')

