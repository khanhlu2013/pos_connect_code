from django.db import models

from sale.models import Receipt,Receipt_ln
from rest_framework import serializers,fields
from store_product.sp_serializer import Store_product_serializer


class Receipt_ln_serializer(serializers.ModelSerializer):
    store_product = Store_product_serializer(many=False)

    class Meta:
        model = Receipt_ln
        fields = ('id','store_product','price','crv','discount','discount_mm_deal','non_product_name','is_taxable','p_type','p_tag','cost','buydown')


class Receipt_serializer(serializers.ModelSerializer):
    receipt_ln_set = Receipt_ln_serializer(many=True)

    class Meta:
        model = Receipt
        fields = ('id','time_stamp','tax_rate','collect_amount','receipt_ln_set')


def serialize_receipt_lst(receipt_lst):
    return Receipt_serializer(receipt_lst,many=True).data  