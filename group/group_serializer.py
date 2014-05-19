from rest_framework import serializers,fields
from store_product.sp_serializer import Store_product_serializer
from group.models import Group

class Group_serializer(serializers.ModelSerializer):
    store_product_set = Store_product_serializer(many=True)

    class Meta:
        model = Group
        fields = ('id','name','store_product_set')


def serialize_group_lst(group_lst):
    return Group_serializer(group_lst,many=True).data  