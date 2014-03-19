from store_product.models import Store_product
import json
from django.core.serializers.json import DjangoJSONEncoder

def get_lookup_type_tag(store_id):
	py_data = {}
 	type_tag_lst =  Store_product.objects.filter(business_id=store_id).values_list('p_type','p_tag').distinct().order_by('p_type','p_tag')

	for item in type_tag_lst:
		p_type,p_tag = item
		if not p_type in py_data:
			py_data[p_type] = [p_tag,]
		else:
			py_data[p_type].append(p_tag)

	js_data = json.dumps(py_data)
	return js_data