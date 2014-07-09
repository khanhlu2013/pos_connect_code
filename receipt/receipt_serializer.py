from rest_framework import serializers,fields
from store_product.sp_serializer import Store_product_serializer
from receipt.models import Receipt,Receipt_ln,Tender_ln

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