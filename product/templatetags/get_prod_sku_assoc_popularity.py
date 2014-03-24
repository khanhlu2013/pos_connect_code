from django import template
from product.models import Product

register = template.Library()

@register.filter(name='get_prod_sku_assoc_popularity')
def get_prod_sku_assoc_popularity(product,sku_str):
    # xxx i need to check if product list already prefecth_related sku_lst
    
    popularity = None
    for prodskuassoc in product.prodskuassoc_set.all():
        if prodskuassoc.sku.sku == sku_str:
            popularity = prodskuassoc.store_product_lst.all().count()
            break;

    if popularity == None:
        raise Exception('sku str is not found for this product')

    return popularity
