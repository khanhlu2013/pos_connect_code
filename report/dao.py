from report.models import Report

def get_report_lst(store_id):
    lst =  Report.objects.filter(store_id=store_id).order_by('name')
    return lst


def get_report_item(id,store_id):
    return Report.objects.prefetch_related('sp_lst').get(pk=id,store_id=store_id)    