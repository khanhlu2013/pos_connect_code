from django import template
from product.models import Product

register = template.Library()

@register.filter(name='get_prod_bus_assoc')
def get_prod_bus_assoc(product,business):
    return product.get_store_product(business)

@register.filter(name='get_prod_bus_assoc_id')
def get_prod_bus_assoc_id(product,business):
    assoc = product.get_store_product(business)
    if assoc: return assoc.id
    else: return None


