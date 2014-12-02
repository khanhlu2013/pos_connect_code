from product.models import Product

def get_lst_base_on_sku(sku_str):
    return Product.objects.filter(sku_set__sku=sku_str).prefetch_related('store_product_set','prodskuassoc_set__store_product_set')

def get_lst_base_on_pid(pid):
    return Product.objects.prefetch_related('store_product_set').get(pk=pid)    