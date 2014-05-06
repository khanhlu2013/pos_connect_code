from receipt import copy_receipt_from_couch_2_master
from sale.models import Receipt 
from receipt import receipt_master_getter
from sale_report import report_calculator

def exe(store_id,from_date,to_date):
    copy_receipt_from_couch_2_master.exe(store_id)
    receipt_lst = receipt_master_getter.get_lst(store_id,from_date,to_date)

    return report_calculator.exe(receipt_lst)