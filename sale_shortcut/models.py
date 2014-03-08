from django.db import models
from product.models import Product
from bus.models import Business

class Parent(models.Model):
    business = models.ForeignKey(Business)
    position = models.IntegerField()
    caption = models.CharField(max_length=30)

    def to_json(self):
		return {
             'id': self.id
            ,'position': self.position
            ,'caption' : self.caption
            ,'child_set': [{'id': child.id, 'position': child.position, 'caption': child.caption, 'product_id': child.product.id} for child in self.child_set.all()] 
        }    	


class Child(models.Model):
	parent = models.ForeignKey(Parent)
	position = models.IntegerField()
	caption = models.CharField(max_length=30)
	product = models.ForeignKey(Product)
