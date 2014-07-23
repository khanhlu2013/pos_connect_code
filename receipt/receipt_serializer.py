from rest_framework import serializers,fields
from store_product.sp_serializer import Breakdown_assoc_serializer,Kit_assoc_serializer
from store_product.models import Store_product
from receipt.models import Receipt,Receipt_ln,Tender_ln

class Store_product_serializer(serializers.ModelSerializer):
    """
        this sp serializer does not contain the 'share' product info(which contain sku assoc info)
    """
    product_id = serializers.Field(source='product.id')
    store_id = serializers.Field(source='store.id')

    def to_native(self,obj):
        if not self.fields.has_key('breakdown_assoc_lst'):
            self.fields['breakdown_assoc_lst'] = Breakdown_assoc_serializer()

        if not self.fields.has_key('kit_assoc_lst'):
            self.fields['kit_assoc_lst'] = Kit_assoc_serializer()

        return super(Store_product_serializer,self).to_native(obj)

    class Meta:
        model = Store_product
        fields = ('id','product_id','store_id','name','price','value_customer_price','crv','is_taxable','is_sale_report','p_type','p_tag','cost','vendor','buydown')


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