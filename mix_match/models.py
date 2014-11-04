from django.db import models
from store.models import Store
from store_product.models import Store_product

class Mix_match(models.Model):
    store = models.ForeignKey(Store)
    name = models.CharField(max_length=100)
    qty = models.IntegerField()
    mm_price = models.DecimalField(max_digits=6, decimal_places=2)
    is_include_crv_tax = models.BooleanField()
    sp_lst = models.ManyToManyField(Store_product)
    is_disable = models.BooleanField()