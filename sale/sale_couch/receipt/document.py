from couchdb.mapping import Document,TextField,DecimalField,ListField,IntegerField,BooleanField,DictField

class Receipt_document(Document):
    d_type = TextField()
    collect_amount = DecimalField()
    ds_lst = ListField(DictField())
    tax_rate = DecimalField()
    time_stamp = IntegerField()
