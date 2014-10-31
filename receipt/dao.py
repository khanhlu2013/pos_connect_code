from receipt.models import Receipt

def get_lst(store_id,from_date,to_date):
    return Receipt.objects.filter(store_id=store_id,date__range=(from_date, to_date)).prefetch_related('receipt_ln_lst').prefetch_related('tender_ln_lst')

