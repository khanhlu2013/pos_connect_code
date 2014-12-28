from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder
from report.report_serializer import Report_serializer
from report import dao
import json
from store_product.models import Store_product

def report_update_angular_view(request):
    cur_login_store = request.session.get('cur_login_store')
    id = request.POST['id'] 
    report_json = json.loads(request.POST['report'])


    sp_lst = []
    if len(report_json['sp_lst']) != 0:
        sp_lst = Store_product.objects.filter(store_id=cur_login_store.id,product_id__in=[sp['product_id'] for sp in report_json['sp_lst']])

    #validate child belong store product of this store        
    if len(sp_lst) != len(report_json['sp_lst']):
        return


    #validate report id 
    report = dao.get_report_item(id=id,store_id=cur_login_store.id)
    if report.store.id != cur_login_store.id:
        return

    #update report
    report.name = report_json['name']
    report.save()

    #remove and add sp
    report.sp_lst.clear()
    if len(sp_lst) !=0:
        report.sp_lst.add(*sp_lst)

    #response
    report = dao.get_report_item(id=id,store_id=cur_login_store.id)
    report_serialized = Report_serializer(report,many=False).data
    return HttpResponse(json.dumps(report_serialized,cls=DjangoJSONEncoder), mimetype='application/json')

