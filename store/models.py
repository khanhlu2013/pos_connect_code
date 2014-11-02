from bus.models import Business
from django.db import models
from store.cm import insert_couch


class Store(Business):
    """ Liquor store object which is a retail business. We also have Vendor which is a distributor business"""
    tax_rate = models.DecimalField(max_digits=5,decimal_places=3)
    api_key_name = models.CharField(max_length=25,blank=True)
    api_key_pwrd = models.CharField(max_length=25,blank=True)
    couch_admin_name = models.CharField(max_length=25)
    couch_admin_pwrd = models.CharField(max_length=25)
    couch_url = models.CharField(max_length=25)

    def save(self,*args,**kwargs):
        if self.id == None:
            #insert temporary api key and pwrd so to satisfy model so that we can have the generated id for the store that is needed both online and offline to create db name on couch
            self.api_key_name = ''
            self.api_key_pwrd = ''
            super(Business,self).save(*args,**kwargs)
            self.api_key_name,self.api_key_pwrd = insert_couch.exe(self.id)

        super(Business,self).save(*args,**kwargs)