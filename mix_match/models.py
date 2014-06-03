from django.db import models
from store.models import Store
from store_product.models import Store_product

class Mix_match(models.Model):
    store = models.ForeignKey(Store)
    name = models.CharField(max_length=100)
    qty = models.IntegerField()
    otd_price = models.DecimalField(max_digits=6, decimal_places=2)


class Mix_match_child(models.Model):
    parent = models.ForeignKey(Mix_match)
    store_product = models.ForeignKey(Store_product)

    class Meta:
        unique_together = ("parent","store_product")