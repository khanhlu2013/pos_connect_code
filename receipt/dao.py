from receipt.models import Receipt

def get_lst(store_id,from_date,to_date):
    return Receipt.objects.filter(store_id=store_id,date__range=(from_date, to_date)).prefetch_related('receipt_ln_lst').prefetch_related('tender_ln_lst')

def get_lst_by_count(store_id,count):
    return Receipt.objects.filter(store_id=store_id).prefetch_related('receipt_ln_lst').prefetch_related('tender_ln_lst').order_by('-date')[:count]

def get_item(id):
    return Receipt.objects.prefetch_related('receipt_ln_lst').prefetch_related('tender_ln_lst').get(pk=id)

def get_item_base_on_doc_id(doc_id):
    return Receipt.objects.prefetch_related('receipt_ln_lst').prefetch_related('tender_ln_lst').get(_receipt_doc_id=doc_id)    