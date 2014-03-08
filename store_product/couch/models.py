from couchdb.mapping import Document,TextField,DecimalField,ListField,IntegerField,BooleanField

class Product_document(Document):
    d_type = TextField()
    name = TextField()
    price = DecimalField()
    crv = DecimalField()
    is_taxable = BooleanField() 
    sku_lst = ListField(TextField())
    business_id = IntegerField()
    product_id = IntegerField()
