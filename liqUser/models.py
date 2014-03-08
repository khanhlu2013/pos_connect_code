from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in
from django.contrib.auth.models import AbstractUser

class Membership(models.Model):
    business = models.ForeignKey('bus.Business')
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    date_join = models.DateField(auto_now_add=True)
    
@receiver(user_logged_in)    
def select_default_login_store(sender,user,request,**kwargs):
    if len(user.business_lst.all()) == 1:
        cur_business = user.business_lst.all()[0]
        if cur_business.store: #cast business to store
            request.session['cur_login_store'] = cur_business
        else:
            #This user only belong to a single vendor
            assert False
        
    elif not user.is_superuser:
        assert False
    