from django.db import models
from store.models import Store
from store_product.models import Store_product
import decimal
from rest_framework import serializers,fields
from store_product.sp_serializer import Store_product_serializer

class Receipt(models.Model):
    time_stamp = models.DateTimeField()
    tax_rate = models.DecimalField(max_digits=6, decimal_places=4)
    store = models.ForeignKey(Store)
    _receipt_doc_id = models.CharField(max_length=40,unique=True)#this field is the receipt doc id from couch.as an optimization for 'copy paste' sale data from couch to master. we bulk create models.Receipt and need this link to document.Receipt to bulk insert models.Receipt_ln
    
    def __unicode__(self):
        return str(self.id)

class Tender_ln(models.Model):
    receipt = models.ForeignKey(Receipt)
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    name = models.CharField(blank=True,null=True,max_length=100)

class Receipt_ln(models.Model):
    receipt = models.ForeignKey(Receipt)
    qty = models.IntegerField()
    store_product = models.ForeignKey(Store_product,blank=True,null=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    crv = models.DecimalField(max_digits=6, decimal_places=3,blank=True,null=True)
    discount = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True)
    discount_mm_deal = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True)
    non_product_name = models.CharField(max_length=30,blank=True,null=True)
    is_taxable = models.BooleanField()
    p_type = models.CharField(blank=True,null=True,max_length=100)
    p_tag = models.CharField(blank=True,null=True,max_length=100)
    cost = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True)
    buydown = models.DecimalField(max_digits=6, decimal_places=2,blank=True,null=True)

    def get_total_out_the_door_price(self):
        discount = self.discount if self.discount!=None else decimal.Decimal(0.0)
        buydown = self.buydown if self.buydown!=None else decimal.Deciaml(0.0)
        discount_mm_deal = self.discount_mm_deal if self.discount_mm_deal != None else decimal.Decimal(0.0)
        crv = self.crv if self.crv!=None else decimal.Decimal('0.0')
        return (self.price - discount - buydown - discount_mm_deal + crv) * self.qty


class Tender_ln_serializer(serializers.ModelSerializer):
    class Meta:
        model = Tender_ln
        fields = ('id','amount','name')

class Receipt_ln_serializer(serializers.ModelSerializer):
    store_product = Store_product_serializer(many=False)
    class Meta:
        model = Receipt_ln
        fields = ('id','qty','store_product','price','crv','discount','discount_mm_deal','non_product_name','is_taxable','p_type','p_tag','cost','buydown')


class Receipt_serializer(serializers.ModelSerializer):
    receipt_ln_set = Receipt_ln_serializer(many=True)
    tender_ln_set = Tender_ln_serializer(many=True)

    class Meta:
        model = Receipt
        fields = ('id','time_stamp','tax_rate','tender_ln_set','receipt_ln_set')


def serialize_receipt_lst(receipt_lst):
    return Receipt_serializer(receipt_lst,many=True).data  