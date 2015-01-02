from product.models import Product
from product import dao
from rest_framework import serializers,fields
from django.http import HttpResponse
import json
from django.core.serializers.json import DjangoJSONEncoder
from store.models import Store
from datetime import date, timedelta
from django.conf import settings
from django.db.models import Sum
from store_product.models import Store_product
from store_product.sp_serializer import Breakdown_assoc_serializer,Kit_assoc_serializer


class Store_product_serializer(serializers.ModelSerializer):
    product_id = serializers.Field(source='product.id')
    store_id = serializers.Field(source='store.id')

    def to_native(self,obj):
        if not self.fields.has_key('breakdown_assoc_lst'):
            self.fields['breakdown_assoc_lst'] = Breakdown_assoc_serializer()

        if not self.fields.has_key('kit_assoc_lst'):
            self.fields['kit_assoc_lst'] = Kit_assoc_serializer()

        return super(Store_product_serializer,self).to_native(obj)

    class Meta:
        model = Store_product
        fields = ('id','product_id','store_id','name','price','value_customer_price','crv','is_taxable','is_sale_report','p_type','p_tag','cost','vendor','buydown')


class Product_serializer(serializers.ModelSerializer):
    store_product_set = Store_product_serializer(many=True)

    class Meta:
        model = Product
        fields = ('store_product_set',)


def _get_store_from_lst_base_on_id(store_id,store_lst):
    result = None
    for store in store_lst:
        if store.id == store_id:
            result = store
            break
    return result


def _get_sale_data(product_id):
    now = date.today()
    end = now - timedelta(days=settings.NETWORK_PRODUCT_SALE_DAY_OFFSET)
    start = end - timedelta(days=settings.NETWORK_PRODUCT_SALE_DAY_LOOKBACK)
    return Store.objects.filter(is_profit_information_exchange=True,receipt__receipt_ln_lst__store_product__product_id=product_id,receipt__date__range=(start,end)).annotate(sale=Sum('receipt__receipt_ln_lst__qty'))


def exe(request):
    #param
    product_id = json.loads(request.GET['product_id'])
    cur_login_store = request.session.get('cur_login_store')
    response = {}

    #get product data
    product = dao.get_item_base_on_pid(product_id)
    product_serialized = Product_serializer(product,many=False).data
    response['product'] = product_serialized

    #get sale data
    sale_data_serialized = []
    if cur_login_store.is_profit_information_exchange:
        sale_data = _get_sale_data(product_id)
        for item in sale_data:
            sale_data_serialized.append({
                 'store_id' : item.id
                ,'sale' : item.sale   
            })
        response['sale'] = sale_data_serialized

    return HttpResponse(json.dumps(response,cls=DjangoJSONEncoder),content_type='application/json')
