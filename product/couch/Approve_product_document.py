from couchdb.mapping import Document,TextField,DecimalField,ListField,IntegerField,BooleanField

class Approve_product_document(Document):
    d_type = TextField()
    product_id = IntegerField()
    name = TextField()
    sku_lst = ListField(TextField())
