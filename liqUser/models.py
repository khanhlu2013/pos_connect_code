from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in
from django.contrib.auth.models import AbstractUser
from store.models import Store

class Membership(models.Model):
    business = models.ForeignKey('bus.Business')
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    date_join = models.DateField(auto_now_add=True)

    
@receiver(user_logged_in)    
def select_default_login_store(sender,user,request,**kwargs):

    # check for super user
    if user.is_superuser:
        # raise Exception('we dont accept super user at this point')
        return


    #user must belong to a single bus for now
    cur_bus = None
    bus_lst = user.business_lst.all()
    bus_lst_len = len(bus_lst)
    if bus_lst_len != 1:
        raise Exception('we dont accept loner user or multi-business user at this point')
    else:
        cur_bus = bus_lst[0]


    #the single bus user belong to must be a store (liquor store) for now
    cur_store = None
    try:
        cur_store = cur_bus.store #casting business into store
    except Store.DoesNotExist:
        raise Exception('we only support store as a business type for now')


    #finally save this store into session    
    cur_store = Store.objects.get(pk=cur_store.id)#download store specific info
    request.session['cur_login_store'] = cur_store