from mix_match.models import Mix_match
from rest_framework import serializers,fields
from store_product.models import Store_product


class Store_product_serializer(serializers.ModelSerializer):
    product_id = serializers.Field(source='product.id')

    class Meta:
        model = Store_product
        fields = ('id','product_id','name','price')


class Mix_match_serializer(serializers.ModelSerializer):
    sp_lst = Store_product_serializer(many=True)

    class Meta:
        model = Mix_match
        fields = ('id','name','mm_price','is_include_crv_tax','qty','sp_lst','is_disable')
