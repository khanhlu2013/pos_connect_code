def get_sp_json_from_product_json(product_json,store_id):
	result = None

	for sp_json in product_json['store_product_set']:
		if sp_json['store_id'] == store_id:
			result = sp_json;
			break;

	return result

def calculate_field(sp_json,field):
	"""
		currently this method is used to calculate field to stamp in sale record. sp_json is retrieved using couch_db python querying couchdb's receipt database.
		I think this json should have similar structure to the serialized json that is send to the client side, but it does not matter, i guess.
	"""
	assoc_lst = sp_json['breakdown_assoc_lst']

	if assoc_lst == None or len(assoc_lst) == 0:
		return sp_json[field]

	result = 0.0
	for assoc in assoc_lst:
		result += ( assoc['qty'] * calculate_field(assoc['breakdown'],field) )
	return result

