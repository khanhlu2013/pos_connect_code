from couchdb.mapping import Document,TextField,DecimalField,ListField,IntegerField,BooleanField,DictField

class Store_product_document(Document):
    
    store_id = IntegerField()
    product_id = IntegerField()    
    d_type = TextField()

    name = TextField()
    price = DecimalField()
    crv = DecimalField()
    is_taxable = BooleanField() 
    is_sale_report = BooleanField()
    p_type = TextField()
    p_tag = TextField()
    sku_lst = ListField(TextField())
    kit_child_bare_lst = ListField(DictField())
    cost = DecimalField()
    vendor = TextField()
    buydown = DecimalField()
