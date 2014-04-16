from sale.models import Receipt

def exe(store_id):
	return Receipt.objects.filter(store__id = store_id).prefetch_related('receipt_ln_set')