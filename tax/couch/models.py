from couchdb.mapping import Document,DecimalField,IntegerField

class Tax_document(Document):
    business_id = IntegerField()
    tax_rate = DecimalField()