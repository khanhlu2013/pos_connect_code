from rest_framework import serializers,fields
from store_product.sp_serializer import Store_product_serializer
from report.models import Report

class Report_serializer(serializers.ModelSerializer):

    class Meta:
        model = Report
        fields = ('id','name')

class Report_sp_lst_serializer(serializers.ModelSerializer):

    sp_lst = Store_product_serializer(many=True)
    class Meta:
        model = Report
        fields = ('id','name','sp_lst')

