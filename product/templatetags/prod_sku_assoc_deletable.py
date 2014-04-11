from django import template
from product.models import Product

register = template.Library()

@register.filter(name='is_prod_sku_assoc_deletable')
def is_prod_sku_assoc_deletable(prod_sku_assoc,business):
    if prod_sku_assoc.creator.id == business.id:
        link_set = prod_sku_assoc.store_product_set.all()

        if len(link_set) == 1 and link_set[0].business.id == business.id:
            return True
        else:
            return False
    else:
        return False