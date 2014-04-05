from rest_framework import serializers,fields
from product.models import Product,ProdSkuAssoc
from store_product.models import Store_product

class Prod_sku_assoc_serializer(serializers.ModelSerializer):
    
    sku_str = serializers.Field(source='sku.sku')
    popularity = serializers.Field(source='get_popularity')
    class Meta:
        model = ProdSkuAssoc
        fields = ('sku_str','popularity',)

class Store_product_serializer(serializers.ModelSerializer):
    price = serializers.Field(source='get_price_str')
    crv = serializers.Field(source='get_crv_str')
    product_id = serializers.Field(source='product.id')
    store_id = serializers.Field(source='store.id')

    class Meta:
        model = Store_product
        fields = ('product_id','store_id','name','p_type','p_tag','price','is_taxable','is_sale_report','crv')


class Product_serializer(serializers.ModelSerializer):
    name = serializers.Field(source='__unicode__')
    store_product_set = Store_product_serializer(many=True)
    prodskuassoc_set = Prod_sku_assoc_serializer(many=True)
    product_id = serializers.Field(source='id')

    class Meta:
        model = Product
        fields = ('name','product_id','store_product_set','prodskuassoc_set')

def serialize_product_from_id(product_id):
    product = list(Product.objects.filter(id=product_id).prefetch_related('store_product_set','prodskuassoc_set__store_product_set'))[0]
    return serialize_product_lst([product,])[0]

def serialize_product_lst(prod_lst):
    return Product_serializer(prod_lst,many=True).data