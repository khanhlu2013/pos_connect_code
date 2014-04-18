from sale import copy_receipt_from_couch_2_master,report_calculator
from sale.models import Receipt 

def exe(store_id,from_date,to_date):
    copy_receipt_from_couch_2_master.exe(store_id)
    receipt_lst = list(Receipt.objects.filter(store_id=store_id,time_stamp__range=(from_date, to_date)).prefetch_related('receipt_ln_set'))

    return report_calculator.exe(receipt_lst)