from sale_shortcut.models import Parent,Child
from rest_framework import serializers,fields
from store_product.sp_serializer import Store_product_serializer

class Child_serializer(serializers.ModelSerializer):

    position = serializers.Field(source='position')
    caption = serializers.Field(source='caption')
    store_product = Store_product_serializer(many=False);

    class Meta:
        model = Child
        fields = ('id','position','caption','store_product')


class Parent_serializer(serializers.ModelSerializer):
    position = serializers.Field(source='position')
    caption = serializers.Field(source='caption')
    child_set = Child_serializer(many=True)

    class Meta:
        model = Parent
        fields = ('id','position','caption','child_set')


def serialize_shortcut_lst(shortcut_lst):
    return Parent_serializer(shortcut_lst,many=True).data        