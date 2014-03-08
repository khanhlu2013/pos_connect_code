from django.db import models
from django.conf import settings

from liquor import import_kt_project_path
from kt_business.models import KT_Business

class Business(KT_Business):
    user_lst = models.ManyToManyField(settings.AUTH_USER_MODEL,through="liqUser.Membership",related_name='business_lst')
    sub_vendors = models.ManyToManyField(
        'vendor.Vendor',
        blank=True,
        null=True,
        related_name = 'sub_stores'        
    )



    



    



