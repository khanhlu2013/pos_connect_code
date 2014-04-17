from couchdb.mapping import Document,TextField,DecimalField,ListField,IntegerField,BooleanField,DictField

class Receipt_document(Document):
    time_stamp = IntegerField()
    tax_rate = DecimalField()    
    ds_lst = ListField(DictField()) 
    collect_amount = DecimalField()   
    d_type = TextField()




