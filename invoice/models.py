from django.db import models
from django.core.exceptions import ValidationError
from store.models import Store
from vendor.models import Vendor

class KT_Invoice(models.Model):
    date_created = models.DateTimeField(auto_now_add=True)
    class Meta:
        abstract = True



class Invoice(KT_Invoice):
    from_vendor = models.ForeignKey(Vendor)
    to_store = models.ForeignKey(Store)
    date_invoice = models.DateField()
    amount = models.DecimalField(max_digits=8,decimal_places=3)
 
 
class InvoiceLn(models.Model):
    pass 