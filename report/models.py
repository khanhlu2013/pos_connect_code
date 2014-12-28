from django.db import models
from store.models import Store

class Report(models.Model):
    name = models.CharField(max_length=100,blank=True,null=True)   
    store = models.ForeignKey(Store)

    def __unicode__(self):
        return self.name

