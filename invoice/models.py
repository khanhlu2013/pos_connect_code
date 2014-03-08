from django.db import models
from django.core.exceptions import ValidationError
from store.models import Store
from vendor.models import Vendor

from liquor import import_kt_project_path
from kt_invoice.models import KT_Invoice


class InvoiceLn(models.Model):
    pass

class Invoice(KT_Invoice):
    from_vendor = models.ForeignKey(Vendor)
    to_store = models.ForeignKey(Store)
    date_invoice = models.DateField()
    amount = models.DecimalField(max_digits=8,decimal_places=3)
 