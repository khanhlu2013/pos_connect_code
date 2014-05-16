from django.db import models
from store.models import Store
from store_product.models import Store_product
from rest_framework import serializers,fields
from store_product.sp_serializer import Store_product_serializer

class Group(models.Model):
	store = models.ForeignKey(Store)
	name = models.CharField(max_length=100)

#-SERIALIZER-------------------------------------------------------------------------------------------------

class Group_serializer(serializers.ModelSerializer):
    store_product_set = Store_product_serializer(many=True)

    class Meta:
        model = Group
        fields = ('id','name','store_product_set')


def serialize_group_lst(group_lst):
    return Group_serializer(group_lst,many=True).data     		