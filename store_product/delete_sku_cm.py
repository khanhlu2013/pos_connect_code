from store_product.sp_couch import store_product_couch_getter
from couch import couch_util
from product.templatetags import prod_sku_assoc_deletable

def content_management(prod_sku_assoc,business):
	if prod_sku_assoc_deletable.is_prod_sku_assoc_deletable(prod_sku_assoc,business):
		#CONTENT MANAGEMENT RELATIONAL DB
		prod_sku_assoc.delete()
		content_management_couch_db(prod_sku_assoc.product.id,business.id,prod_sku_assoc.sku.sku)

def content_management_couch_db(product_id,business_id,sku_str):
	prod_bus_assoc_doc = store_product_couch_getter.exe(product_id,business_id)
	sku_lst = prod_bus_assoc_doc['sku_lst']

	for idx,cur_sku in enumerate(sku_lst):
		if(cur_sku == sku_str):
			del sku_lst[idx]
			break
	db = couch_util.get_store_db(business_id)
	db.update([prod_bus_assoc_doc,])