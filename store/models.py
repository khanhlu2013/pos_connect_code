from bus.models import Business
from django.db import models
from store.store_inserter import insert_store_cm
from store import update_store_cm

class Store(Business):
    """ Liquor store object which is a retail business. We also have Vendor which is a distributor business"""
    tax_rate = models.DecimalField(max_digits=5,decimal_places=3)
    api_key_name = models.CharField(max_length=25,blank=True)
    api_key_pwrd = models.CharField(max_length=25,blank=True)

    def save(self,*args,**kwargs):
        if('by_pass_cm' in kwargs):
            kwargs.pop('by_pass_cm')
            super(Business,self).save(*args,**kwargs)
        else:
            if self.id == None:
                insert_store_cm.exe(self)
            else:
                update_store_cm.exe(self)

            
