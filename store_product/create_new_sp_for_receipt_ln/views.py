from store_product.create_new_sp_for_receipt_ln import create_new_sp_for_receipt_ln
from django.http import HttpResponse
import json

def create_new_sp_for_receipt_ln_view(request):
	cur_login_store = request.session.get('cur_login_store')
	item_created = create_new_sp_for_receipt_ln.exe(cur_login_store.id)
	return HttpResponse(json.dumps(item_created),content_type='application/json')
