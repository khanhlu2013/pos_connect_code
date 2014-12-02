from product import dao
from product.models import Product
from store_product.sp_serializer import Store_product_serializer
from rest_framework import serializers,fields
from django.http import HttpResponse
import json
from django.core.serializers.json import DjangoJSONEncoder

class Product_serializer(serializers.ModelSerializer):
    name = serializers.Field(source='__unicode__')
    product_id = serializers.Field(source='id')    
    store_product_set = Store_product_serializer(many=True)

    class Meta:
        model = Product
        fields = ('name','product_id','store_product_set')

def exe(request):
    data = json.loads(request.GET['data'])
    lst = dao.get_lst_base_on_pid(data['product_id'])
    response = Product_serializer(lst,many=False).data
    return HttpResponse(json.dumps(response,cls=DjangoJSONEncoder),content_type='application/json')