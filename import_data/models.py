from django.db import models
import csv


class Tiep_data(models.Model):
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=100)
    cost = models.DecimalField(max_digits=6, decimal_places=2)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    crv = models.DecimalField(max_digits=6, decimal_places=2)
    is_taxable = models.BooleanField()

def i():
    Tiep_data.objects.all().delete()

    f = open( "tiep_temp_data.txt", "r" )
    data = []
    for line in f:
        raw = line.split(',')
        print(raw)
        # is_taxable_raw = raw[0]
        # sku_raw = raw[1]
        # name_raw = raw[2]
        # cost_raw = raw[3]
        # price_raw = raw[4]
        # crv_raw = raw[5]

        # is_taxable_cook = True if is_taxable_raw == 'TRUE' else False

        # cook = Tiep_data(name=name_raw,sku=sku_raw,cost=cost_raw,price=price_raw,crv=crv_raw,is_taxable=is_taxable_cook)
        # data.append( cook )
    

    # Tiep_data.objects.bulk_create(data)
    # print(data)
    f.close()   


def ii():
    data = []
    Tiep_data.objects.all().delete()

    with open('_.txt', 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for raw in spamreader:
            is_taxable_raw = raw[0]
            sku_raw = raw[1]
            name_raw = raw[2]
            cost_raw = raw[3]
            price_raw = raw[4]
            crv_raw = raw[5]

            if '(' in cost_raw:
                continue

            if '(' in price_raw:
                continue

            is_taxable_cook = True if is_taxable_raw == 'TRUE' else False

            cook = Tiep_data(name=name_raw,sku=sku_raw,cost=cost_raw,price=price_raw,crv=crv_raw,is_taxable=is_taxable_cook)
            data.append( cook )

        Tiep_data.objects.bulk_create(data)


