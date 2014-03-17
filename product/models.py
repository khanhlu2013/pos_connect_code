from django.db import models
from django.core.exceptions import MultipleObjectsReturned,ObjectDoesNotExist,ValidationError
from bus.models import Business

class Unit(models.Model):
    name = models.CharField(max_length=100)
    abbreviate = models.CharField(max_length=20)
    creator = models.ForeignKey(Business,blank=True,null=True)
    is_approved = models.BooleanField()
    _old_id = models.IntegerField(null=True)  
    
    def __unicode__(self):
        return self.abbreviate
    

class Sku(models.Model):
    sku = models.CharField(max_length=30,unique=True)
    creator = models.ForeignKey(Business,blank=True,null=True)
    is_approved = models.BooleanField()
    _old_id = models.IntegerField(null=True)  
    def __unicode__(self):
        return self.sku


class ProdSkuAssoc(models.Model):
    sku = models.ForeignKey(Sku)
    product = models.ForeignKey('product.Product')
    creator = models.ForeignKey(Business,blank=True,null=True)
    is_approve_override = models.BooleanField()
    store_product_lst = models.ManyToManyField('store_product.Store_product')#list of business support this product_sku_assoc
    
    def _is_dynamic_approve(self,frequency):
        return len(self.store_product_lst.all()) == frequency

    def is_approve(self,frequency):
        return self.is_approve_override or self._is_dynamic_approve(frequency)

    class Meta:
        unique_together = ("sku","product")


class Product(models.Model):
    _name_admin = models.CharField(max_length=255,null=True,blank=True)
    _size_admin = models.CharField(max_length=10,null=True,blank=True)
    _unit_admin = models.ForeignKey(Unit,null=True,blank=True)
    temp_name = models.CharField(max_length=255,blank=True,null=True)
    _old_id = models.IntegerField(null=True)        

    creator = models.ForeignKey(Business,null=True,blank=True,related_name='created_prod_lst')
    sku_lst = models.ManyToManyField(Sku,through=ProdSkuAssoc)
    bus_lst = models.ManyToManyField(Business,through='store_product.Store_product',related_name='private_prod_lst')#list of business that contain this product

    def is_approve(self,frequency):
        result = False
        for prod_sku_assoc in self.prodskuassoc_set.all():
            if prod_sku_assoc.is_approve(frequency):
                result = True
                break
        return result

    def get_store_product(self,business):
        try:
            store_product = self.store_product_set.get(business__id=business.id)
        except ObjectDoesNotExist:
            store_product = None
        return store_product

    def __unicode__(self):
        if self._name_admin:
            ret = self._name_admin
            if self._size_admin: ret += (' ' + self._size_admin)
            if self._unit_admin: ret += (' ' + self._unit_admin.__unicode__())
            return ret
        else:
            return self.temp_name
    
    def clean(self):
        #cleaning field
        self._name_admin = self._name_admin.strip()
        self._size_admin = self._size_admin.strip()
        self.temp_name = self.temp_name.strip()

        #validate
        if not self._name_admin and not self.temp_name:
            raise ValidationError('product need a name')
        
    