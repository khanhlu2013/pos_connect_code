from django.db import models
from store.models import Store
from product.models import Product    
from couch import couch_util


class Store_product(models.Model):
    product = models.ForeignKey(Product)
    store = models.ForeignKey(Store)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    crv = models.DecimalField(max_digits=6, decimal_places=3,blank=True,null=True)
    is_taxable = models.BooleanField()
    is_sale_report = models.BooleanField(default=True)
    p_type = models.CharField(blank=True,null=True,max_length=100)
    p_tag = models.CharField(blank=True,null=True,max_length=100)
    cost = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True)
    vendor = models.CharField(blank=True,null=True,max_length=100)
    buydown = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True)

    class Meta:
        unique_together = ("product","store")
        
    def __unicode__(self):
        return self.name
    
    def clean(self):
        self.name = self.name.strip()
        if not self.name:
            raise ValidationError("Please provide product's name")

