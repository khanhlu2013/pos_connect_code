from store_product.models import Store_product

def by_pid_lst_and_store_id(pid_lst,store_id):
    return list(Store_product.objects.filter(product_id__in=pid_lst).filter(store_id = store_id))

def get_item(product_id,store_id):
    return Store_product.objects.get(product_id=product_id,store_id=store_id)

def get_lst_by_sku(sku,store_id):
    return Store_product.objects.filter(store_id=store_id,product__prodskuassoc__store_product_set__store_id=store_id,product__prodskuassoc__sku__sku=sku)