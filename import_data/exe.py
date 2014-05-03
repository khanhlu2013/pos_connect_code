from product.models import Sku
import csv

def exe():
    store = Store.objects.get(name='x')
	sku_lst = Sku.objects.all().prefetch_related('prodskuassoc_set__store_product_set')

	# Dept_ID,Description,Tax_1,itemnum,Vendor,ItemName,CRV,Quan_In_Case,Cost,Price
    log_file = open('log','w')

    with open('_.txt', 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        sp_lst = []

        for raw in spamreader:
            
            dep_id_raw = raw[0]
            type_raw = raw[1]
            is_taxable_raw = raw[2]
 			sku_raw = raw[3]
            vendor_raw = raw[4]
 			name_raw = raw[5]
            crv_raw = raw[6]
            qty_in_case_raw = raw[7]
            cost_raw = raw[8]
 			price_raw = raw[9]
			buydown = None

            if '(' in cost_raw:
                continue

            if '(' in price_raw:
                continue

            is_taxable_cook = True if is_taxable_raw == 'TRUE' else False

            sp = form_sp( \
            	 log_file = log_file
            	,sku_lst = sku_lst
            	,type = type_raw
            	,is_taxable = is_taxable_cook
            	,sku = sku_raw
            	,vendor = vendor_raw
            	,name = name_raw
            	,crv = crv_raw
            	,cost = cost_raw
            	,price = price_raw
            	,buydown = buydown
            )
            sp_lst.append(sp)


        #GOT SP LIST, NOW WE CAN INSERT
		insert_sp_lst(sp_lst) 

    log_file.close() # you can omit in most cases as the destructor will call if	


def form_sp(log_file,sku_lst,type,is_taxable,sku,vendor,name,crv,cost,price,buydown):




------------------

get data_lst that sku does not exist

	.product: create this list with an extra field: sku_str 
	.sku: create this list
	.store_product: create this list by first get a list of all product with extra field sku_str. use this sku_str field to find out what is pid to use to create sp.
	.prodskuassoc: create this list using the same logic as above to find out pid and sp_id to use

when sku is exist, assuming we only have 1 product, if not use log file to find out problem
	.store_product
	.update prod_sku_assoc









