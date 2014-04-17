from django.db import models
from store.models import Store
from store_product.models import Store_product
import decimal

class Receipt(models.Model):
    time_stamp = models.DateTimeField()
    collect_amount = models.DecimalField(max_digits=6, decimal_places=2)
    tax_rate = models.DecimalField(max_digits=6, decimal_places=4)
    store = models.ForeignKey(Store)
    _doc_id_creator = models.CharField(max_length=40,unique=True)#this field is the receipt doc id from couch.as an optimization for moving sale data from couch to master. we bulk create receipt and need this link to bulk insert receipt_ln
    def __unicode__(self):
        return str(self.id) + ' ' + str(self.collect_amount)


class Receipt_ln(models.Model):
    receipt = models.ForeignKey(Receipt)
    qty = models.IntegerField()
    store_product = models.ForeignKey(Store_product,blank=True,null=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    discount = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True)
    non_product_name = models.CharField(max_length=30,blank=True,null=True)

    def get_total_out_the_door_price(self):
        return (decimal.Decimal(self.price) - (decimal.Decimal(self.discount) if self.discount!=None else decimal.Decimal('0.0'))) * self.qty


