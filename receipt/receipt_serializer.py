from rest_framework import serializers,fields
from store_product.sp_serializer import Breakdown_assoc_serializer,Kit_assoc_serializer
from store_product.models import Store_product
from receipt.models import Receipt,Receipt_ln,Tender_ln
from payment_type.models import Payment_type

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

class Payment_type_serializer(serializers.ModelSerializer):
    class Meta:
        model = Payment_type
        fields = ('id','name','sort','active')

class Tender_ln_serializer(serializers.ModelSerializer):
    payment_type = Payment_type_serializer()

    class Meta:
        model = Tender_ln
        fields = ('id','amount','name','payment_type')

class Receipt_ln_serializer(serializers.ModelSerializer):
    store_product = Store_product_serializer(many=False)
    
    class Meta:
        model = Receipt_ln
        fields = (
             'id','qty','discount','override_price','date'
            ,'store_product'
            ,'sp_stamp_name'
            ,'sp_stamp_price'
            ,'sp_stamp_value_customer_price'
            ,'sp_stamp_crv'
            ,'sp_stamp_is_taxable'
            ,'sp_stamp_p_type'
            ,'sp_stamp_p_tag'
            ,'sp_stamp_cost'
            ,'sp_stamp_vendor'
            ,'sp_stamp_buydown'
            ,'mm_deal_discount'
            ,'mm_deal_name'
            ,'non_inventory_name'
            ,'non_inventory_price'
            ,'non_inventory_crv'
            ,'non_inventory_cost'
            ,'non_inventory_is_taxable'
        )

class Receipt_serializer(serializers.ModelSerializer):
    receipt_ln_lst = Receipt_ln_serializer(many=True)
    tender_ln_lst = Tender_ln_serializer(many=True)

    class Meta:
        model = Receipt
        fields = ('id','date','tax_rate','tender_ln_lst','receipt_ln_lst','_receipt_doc_id')


def serialize_receipt_lst(receipt_lst):
    return Receipt_serializer(receipt_lst,many=True).data  