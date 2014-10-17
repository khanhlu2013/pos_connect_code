from store_product.cm import add_sku_cm
from store.models import Store
import csv
from store_product.models import Store_product
from group.models import Group

def exe():
    store = Store.objects.get(name = "1")
    
    # Dept_ID,Description,Tax_1,itemnum,Vendor,ItemName,CRV,Price,Cost
    log_file = open('id/log','w')

    with open('id/data_tiep_full_group.txt', 'rb') as csvfile:
        # Dept_ID,Description,Tax_1,itemnum,Vendor,ItemName,CRV,Quan_In_Case,Cost,Price

        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for raw in spamreader:
            
            group_name = raw[0].replace('"','').strip()
            product_name = raw[1].replace('"','').strip()

            group,is_created = Group.objects.get_or_create(name=group_name,defaults={'store_id':store.id})
            sp = Store_product.objects.get(name=product_name)
            sp.group_lst.add(group)

    log_file.close() # you can omit in most cases as the destructor will call if