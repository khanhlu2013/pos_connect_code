from django.db import models
from bus.models import Business

class Vendor(Business):
    creator = models.ForeignKey('store.Store',blank=True,null = True)   
    is_approved = models.BooleanField(default=False)
