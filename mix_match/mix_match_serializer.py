from mix_match.models import Mix_match,Mix_match_child
from rest_framework import serializers,fields
from store_product.models import Store_product
from store_product.sp_serializer import Store_product_serializer



class Mix_match_child_serializer(serializers.ModelSerializer):
    store_product = Store_product_serializer(many=False)

    class Meta:
        model = Mix_match_child
        fields = ('id','store_product')


class Mix_match_serializer(serializers.ModelSerializer):
    mix_match_child_set = Mix_match_child_serializer(many=True)

    class Meta:
        model = Mix_match
        fields = ('id','name','unit_discount','qty','mix_match_child_set')


def serialize_mix_match_lst(mix_match_lst):
    return Mix_match_serializer(mix_match_lst,many=True).data        