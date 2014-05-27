from rest_framework import serializers,fields
from product.models import Product,ProdSkuAssoc
from store_product.models import Store_product,Kit_breakdown_assoc
from group.models import Group


class Prod_sku_assoc_serializer(serializers.ModelSerializer):
    product_id = serializers.Field(source='product.id')
    sku_str = serializers.Field(source='sku.sku')
    creator_id = serializers.Field(source='creator.id')
    store_set = serializers.Field(source='get_store_set')
    class Meta:
        model = ProdSkuAssoc
        fields = ('sku_str','store_set','creator_id','product_id')


class Group_serializer(serializers.ModelSerializer):
    """
        this group serializer does not contain sp to prevent infinite recursive sp -> group -> sp ...
    """
    class Meta:
        model = Group
        fields = ('id','name')


class Store_product_without_breakdown_serializer(serializers.ModelSerializer):
    product_id = serializers.Field(source='product.id')
    store_id = serializers.Field(source='store.id')
    group_set = Group_serializer(many=True)

    class Meta:
        model = Store_product
        fields = ('id','product_id','store_id','name','price','crv','is_taxable','is_sale_report','p_type','p_tag','cost','vendor','buydown','group_set')


class Kit_breakdown_assoc_serializer():
    breakdown = Store_product_without_breakdown_serializer(many=False)
    class Meta:
        model = Kit_breakdown_assoc
        fields = ('breakdown','qty')


class Store_product_serializer(serializers.ModelSerializer):
    product_id = serializers.Field(source='product.id')
    store_id = serializers.Field(source='store.id')
    group_set = Group_serializer(many=True)
    kit_breakdown_assoc_set = Kit_breakdown_assoc_serializer(many=True)

    class Meta:
        model = Store_product
        fields = ('id','product_id','store_id','name','price','crv','is_taxable','is_sale_report','p_type','p_tag','cost','vendor','buydown','group_set','kit_breakdown_assoc_set')


class Product_serializer(serializers.ModelSerializer):
    name = serializers.Field(source='__unicode__')
    store_product_set = Store_product_serializer(many=True)
    prodskuassoc_set = Prod_sku_assoc_serializer(many=True)
    product_id = serializers.Field(source='id')

    class Meta:
        model = Product
        fields = ('name','product_id','store_product_set','prodskuassoc_set')


def serialize_product_from_id(product_id,store_id,is_include_other_store):
    query_set = Product.objects.filter(id=product_id)
    query_set.prefetch_related('store_product_set__kit_breakdown_assoc_set','prodskuassoc_set__store_product_set')
        
    if not is_include_other_store:
        query_set.filter(store_product__store_id = store_id)

    prod_lst = serialize_product_lst(query_set)
    assert(len(prod_lst)==1)
    return prod_lst[0]


def serialize_product_lst(prod_lst):
    return Product_serializer(prod_lst,many=True).data


"""
{
     'name': u'1 - x'
    ,'product_id': 80
    ,'store_product_set': 
        [
             {'product_id': 80, 'store_id': 33, 'name': u'1 - y'}
            ,{'product_id': 80, 'store_id': 32, 'name': u'1 - x'}
        ]
    ,'prodskuassoc_set': 
        [
            {
                 'sku_str': u'1'
                ,'store_set': [32, 33]
                ,'creator_id': 32
                ,'product_id': 80
            }
        ]
}



{
     'name': u'1 - x'
    ,'product_id': 80
    ,'store_product_set': 
        [
             {'product_id': 80, 'store_id': 33, 'name': u'1 - y'}
            ,{'product_id': 80, 'store_id': 32, 'name': u'1 - x'}
        ]
    , 'prodskuassoc_set': 
        [
            {
                 'sku_str': u'1'
                ,'store_set': [32, 33]
                ,'creator_id': 32
                ,'product_id': 80
            }
            , 
            {
                  'sku_str': u'11'
                , 'store_set': [33]
                , 'creator_id': 33
                , 'product_id': 80
            }
        ]
}


"""    