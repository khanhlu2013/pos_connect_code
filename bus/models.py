from django.db import models
from django.conf import settings

class Address(models.Model):
    street = models.CharField(max_length=255,blank=True)
    city = models.CharField(max_length=255,blank=True)
    state = models.CharField(max_length=2,blank=True)
    zip_code = models.IntegerField(max_length=5,blank=True,null=True)

    class Meta:
        abstract = True

    def clean(self):
        self.street = self.street.strip()
        self.city = self.city.strip()
        self.state = self.state.strip()

        if self.street or self.city or self.state or self.zip_code:
            if not (self.street and self.city and self.state and self.zip_code):
                raise ValidationError('Please provide all address fields')

class KT_Business(Address):
    name = models.CharField(max_length=255)
    
    def __unicode__(self):
        return self.name
    
    class Meta:
        abstract = True


class Business(KT_Business):
    user_lst = models.ManyToManyField(settings.AUTH_USER_MODEL,through="liqUser.Membership",related_name='business_lst')
    sub_vendors = models.ManyToManyField(
        'vendor.Vendor',
        blank=True,
        null=True,
        related_name = 'sub_stores'        
    )