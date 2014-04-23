from mix_match.models import Mix_match,Mix_match_child
from rest_framework import serializers,fields
from store_product.models import Store_product

class Store_product_serializer(serializers.ModelSerializer):
    price = serializers.Field(source='get_price_str')
    crv = serializers.Field(source='get_crv_str')
    product_id = serializers.Field(source='product.id')
    store_id = serializers.Field(source='store.id')


    class Meta:
        model = Store_product
        fields = ('product_id','store_id','name','p_type','p_tag','price','is_taxable','is_sale_report','crv')


class Mix_match_child_serializer(serializers.ModelSerializer):
    store_product = Store_product_serializer(many=False)

    class Meta:
        model = Mix_match_child
        fields = ('id','store_product')


class Mix_match_serializer(serializers.ModelSerializer):
    mix_match_child_lst = Mix_match_child_serializer(many=True)

    class Meta:
        model = Mix_match
        fields = ('name','unit_discount','qty','mix_match_child_lst')


def serialize_mix_match_lst(mix_match_lst):
    return Mix_match_serializer(mix_match_lst,many=True).data        