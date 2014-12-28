from report.models import Report
from store_product import dao,sp_serializer
from django.http import HttpResponse
import json
from django.core.serializers.json import DjangoJSONEncoder


def exe(request):
    cur_login_store = request.session.get('cur_login_store')
    sp_json = json.loads(request.POST['sp']) 

    #validate sp belong to the store
    sp = dao.get_item(product_id=sp_json['product_id'],store_id=cur_login_store.id)

    #validate report belong to store
    report_lst = []
    if len(sp_json['report_lst']) >0:
        report_lst = Report.objects.filter(store_id=cur_login_store.id,pk__in=[report['id'] for report in sp_json['report_lst']])
        if len(report_lst) != len(sp_json['report_lst']):
            return

    #remove all report from sp
    sp.report_lst.clear()

    #add report
    if len(report_lst) != 0:
        sp.report_lst.add(*report_lst)

    product_serialized = sp_serializer.Store_product_serializer(sp).data   
    return HttpResponse(json.dumps(product_serialized,cls=DjangoJSONEncoder),content_type='application/json')    



