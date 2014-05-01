from django.db import models
from store.models import Store
from store_product.models import Store_product
from rest_framework import serializers,fields
from store_product.sp_serializer import Store_product_serializer

class Group(models.Model):
	store = models.ForeignKey(Store)
	name = models.CharField(max_length=100)


class Group_child(models.Model):
	group = models.ForeignKey(Group)
	store_product = models.ForeignKey(Store_product)

	class Meta:
		unique_together = ('group','store_product')

#-SERIALIZER-------------------------------------------------------------------------------------------------


class Group_child_serializer(serializers.ModelSerializer):
    store_product = Store_product_serializer(many=False)

    class Meta:
        model = Group_child
        fields = ('id','store_product')


class Group_serializer(serializers.ModelSerializer):
    group_child_set = Group_child_serializer(many=True)

    class Meta:
        model = Group
        fields = ('id','name','group_child_set')


def serialize_group_lst(group_lst):
    return Group_serializer(group_lst,many=True).data     		