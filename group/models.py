from django.db import models
from store.models import Store


class Group(models.Model):
	store = models.ForeignKey(Store)
	name = models.CharField(max_length=100)


   		