from receipt import copy_receipt_from_couch_2_master,receipt_master_getter


def exe(store_id,from_date,to_date):
	copy_receipt_from_couch_2_master.exe(store_id)
	return receipt_master_getter.get_lst(store_id,from_date,to_date)
