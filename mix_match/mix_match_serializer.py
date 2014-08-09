from mix_match.models import Mix_match
from rest_framework import serializers,fields
from store_product.models import Store_product
from store_product.sp_serializer import Store_product_serializer


class Mix_match_serializer(serializers.ModelSerializer):
    sp_lst = Store_product_serializer(many=True)

    class Meta:
        model = Mix_match
        fields = ('id','name','mm_price','is_include_crv_tax','qty','sp_lst')


def serialize_mix_match_lst(mix_match_lst):
    return Mix_match_serializer(mix_match_lst,many=True).data        