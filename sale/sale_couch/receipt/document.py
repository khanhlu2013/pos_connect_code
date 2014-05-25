from couchdb.mapping import Document,TextField,DecimalField,ListField,IntegerField,BooleanField,DictField

class Receipt_document(Document):
    tender_lst = ListField(DictField()) 
    time_stamp = IntegerField()
    tax_rate = DecimalField()    
    ds_lst = ListField(DictField()) 
    d_type = TextField()




