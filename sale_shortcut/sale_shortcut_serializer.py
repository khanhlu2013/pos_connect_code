from sale_shortcut.models import Parent,Child
from rest_framework import serializers,fields


class Child_serializer(serializers.ModelSerializer):
    position = serializers.Field(source='position')
    caption = serializers.Field(source='caption')
    pid = serializers.Field(source='store_product.product.id')
    product_name = serializers.Field(source='store_product.name')

    class Meta:
        model = Child
        fields = ('position','caption','pid','product_name')


class Parent_serializer(serializers.ModelSerializer):
    position = serializers.Field(source='position')
    caption = serializers.Field(source='caption')
    child_set = Child_serializer(many=True)

    class Meta:
        model = Parent
        fields = ('position','caption','child_set')


def serialize_shortcut_lst(shortcut_lst):
    return Parent_serializer(shortcut_lst,many=True).data        