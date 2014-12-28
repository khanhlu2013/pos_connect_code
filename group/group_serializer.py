from rest_framework import serializers,fields
from store_product.sp_serializer import Store_product_serializer
from group.models import Group

class Group_serializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = ('id','name')

class Group_sp_lst_serializer(serializers.ModelSerializer):

    sp_lst = Store_product_serializer(many=True)
    class Meta:
        model = Group
        fields = ('id','name','sp_lst')

