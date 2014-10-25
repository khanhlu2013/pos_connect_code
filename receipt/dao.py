from receipt.models import Receipt

def get_lst(store_id,from_date,to_date):
    return Receipt.objects.filter(store_id=store_id,date__range=(from_date, to_date)).prefetch_related('receipt_ln_lst').prefetch_related('tender_ln_lst')

def get_lst_by_count(store_id,count):
    return Receipt.objects.filter(store_id=store_id).prefetch_related('receipt_ln_lst').prefetch_related('tender_ln_lst').order_by('-date')[:count]