from django import template
from product.models import Product

register = template.Library()

@register.filter(name='is_prod_sku_assoc_deletable')
def is_prod_sku_assoc_deletable(prod_sku_assoc,business):
    if prod_sku_assoc.creator == business:
        link_set = prod_sku_assoc.store_product_lst.all()
        if len(link_set) == 1 and link_set[0].business == business:
            return True
        else:
            return False
    else:
        return False


