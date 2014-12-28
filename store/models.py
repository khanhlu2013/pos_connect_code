from bus.models import Business
from django.db import models
from store.cm import insert_store_2_couch


class Store(Business):
    """ Liquor store object which is a retail business. We also have Vendor which is a distributor business"""
    tax_rate = models.DecimalField(max_digits=5,decimal_places=3)
    api_key_name = models.CharField(max_length=25,blank=True)
    api_key_pwrd = models.CharField(max_length=25,blank=True)
    couch_admin_name = models.CharField(max_length=100)
    couch_admin_pwrd = models.CharField(max_length=100)
    couch_url = models.CharField(max_length=100)

    display_is_report = models.BooleanField(default=True)
    display_type = models.BooleanField(default=True)
    display_tag = models.BooleanField(default=True)
    display_group = models.BooleanField(default=True)
    display_deal = models.BooleanField(default=True)
    display_vendor = models.BooleanField(default=True)
    display_buydown = models.BooleanField(default=True)
    display_vc_price = models.BooleanField(default=True)
    display_stock = models.BooleanField(default=True)

    def save(self,*args,**kwargs):
        if self.id == None:
            #insert temporary api key and pwrd so to satisfy model so that we can have the generated id for the store that is needed both online and offline to create db name on couch
            self.api_key_name = ''
            self.api_key_pwrd = ''
            super(Business,self).save(*args,**kwargs)
            self.api_key_name,self.api_key_pwrd = insert_store_2_couch.exe(self.id,self.couch_admin_name,self.couch_admin_pwrd,self.couch_url)

        super(Business,self).save(*args,**kwargs)