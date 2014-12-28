from store.models import Store
from rest_framework import serializers,fields

class Store_serializer(serializers.ModelSerializer):
    
    class Meta:
        model = Store
        fields = ('id','name','phone','street','city','state','zip_code','tax_rate',
            'display_is_report',
            'display_type',
            'display_tag',
            'display_group',
            'display_deal',
            'display_vendor',
            'display_buydown',
            'display_vc_price',
            'display_stock'
        )
