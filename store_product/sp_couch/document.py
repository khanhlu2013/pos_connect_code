from couchdb.mapping import Document,TextField,DecimalField,ListField,IntegerField,BooleanField,DictField

class Store_product_document(Document):
    id = IntegerField()
    store_id = IntegerField()
    product_id = IntegerField()    
    d_type = TextField()

    name = TextField()
    price = DecimalField()
    value_customer_price = DecimalField()
    crv = DecimalField()
    is_taxable = BooleanField() 
    is_sale_report = BooleanField()
    p_type = TextField()
    p_tag = TextField()
    cost = DecimalField()
    vendor = TextField()
    buydown = DecimalField()
    
    sku_lst = ListField(TextField())
    breakdown_assoc_lst = ListField(DictField())

