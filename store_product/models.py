from django.db import models
from store.models import Store
from product.models import Product    
from couch import couch_util


class Store_product(models.Model):
    product = models.ForeignKey(Product)
    store = models.ForeignKey(Store)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    value_customer_price = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True) #preset override_price
    crv = models.DecimalField(max_digits=6, decimal_places=3,blank=True,null=True)
    is_taxable = models.BooleanField()
    is_sale_report = models.BooleanField(default=True)
    p_type = models.CharField(blank=True,null=True,max_length=100)
    p_tag = models.CharField(blank=True,null=True,max_length=100)
    cost = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True)
    vendor = models.CharField(blank=True,null=True,max_length=100)
    buydown = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True)
    group_lst = models.ManyToManyField('group.Group',related_name='sp_lst')
    breakdown_lst = models.ManyToManyField('self',symmetrical=False,through='Kit_breakdown_assoc',related_name='kit_lst')
    sp_doc_id = models.CharField(blank=True,null=True,max_length=100)# if not null, these are product that are created offline. these field prevent created_offline product to be re_create multiple time on the server due to the possibility of client's failure to remove offline create product after the server created them and sync them down. 

    class Meta:
        unique_together = ("product","store")
        
    def __unicode__(self):
        return self.name
    
    def clean(self):
        self.name = self.name.strip()
        if not self.name:
            raise ValidationError("Please provide product's name")


class Kit_breakdown_assoc(models.Model):
    kit = models.ForeignKey(Store_product,related_name='breakdown_assoc_lst')
    breakdown = models.ForeignKey(Store_product,related_name='kit_assoc_lst')
    qty = models.IntegerField()