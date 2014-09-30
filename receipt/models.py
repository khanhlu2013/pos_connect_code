from django.db import models
from store.models import Store
from store_product.models import Store_product
import decimal
from payment_type.models import Payment_type

class Receipt(models.Model):
    date = models.DateTimeField()
    tax_rate = models.DecimalField(max_digits=6, decimal_places=4)
    store = models.ForeignKey(Store)
    _receipt_doc_id = models.CharField(max_length=40,unique=True)#this field is the receipt doc id from couch.as an optimization to save sale data to master. we bulk create models.Receipt and need this link to document.Receipt to bulk insert models.Receipt_ln
    
    def __unicode__(self):
        return str(self.id)

class Tender_ln(models.Model):
    receipt = models.ForeignKey(Receipt,related_name="tender_ln_lst")
    payment_type = models.ForeignKey(Payment_type,blank=True,null=True)
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    name = models.CharField(blank=True,null=True,max_length=100)

class Receipt_ln(models.Model):
    receipt = models.ForeignKey(Receipt,related_name="receipt_ln_lst")
    qty = models.IntegerField()
    discount = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True)
    override_price = models.DecimalField(max_digits=6, decimal_places=3,blank=True,null=True)
    date = models.DateTimeField()
    store_product = models.ForeignKey(Store_product,blank=True,null=True)
    
    sp_stamp_name = models.CharField(max_length=100,blank=True,null=True)   
    sp_stamp_price = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True)
    sp_stamp_value_customer_price = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True)
    sp_stamp_crv = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True)
    sp_stamp_is_taxable = models.NullBooleanField(blank=True,null=True)
    sp_stamp_is_sale_report = models.NullBooleanField(blank=True,null=True)
    sp_stamp_p_type = models.CharField(max_length=100,blank=True,null=True)   
    sp_stamp_p_tag = models.CharField(max_length=100,blank=True,null=True)   
    sp_stamp_cost = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True)
    sp_stamp_vendor = models.CharField(max_length=100,blank=True,null=True)   
    sp_stamp_buydown = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True)

    mm_deal_discount = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True)
    mm_deal_name = models.CharField(max_length=100,blank=True,null=True) 

    non_inventory_name = models.CharField(max_length=100,blank=True,null=True)  
    non_inventory_price = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True)

    def get_total_out_the_door_price(self):
        discount = self.discount if self.discount!=None else decimal.Decimal(0.0)
        buydown = self.buydown if self.buydown!=None else decimal.Decimal(0.0)
        discount_mm_deal = self.discount_mm_deal if self.discount_mm_deal != None else decimal.Decimal(0.0)
        crv = self.crv if self.crv!=None else decimal.Decimal('0.0')
        return (self.price - discount - buydown - discount_mm_deal + crv) * self.qty
