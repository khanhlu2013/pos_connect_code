from payment_type.models import Payment_type
from rest_framework import serializers,fields


class Payment_type_serializer(serializers.ModelSerializer):
    
    class Meta:
        model = Payment_type
        fields = ('id','name')

def serialize_payment_type_lst(lst):
    return Payment_type_serializer(lst,many=True).data        