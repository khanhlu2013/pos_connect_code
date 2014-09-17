from django.db import models
from store.models import Store

class Payment_type(models.Model):
    store = models.ForeignKey(Store)
    name = models.CharField(max_length=100,unique=True)
    sort = models.CharField(max_length=100)
    active = models.BooleanField()
