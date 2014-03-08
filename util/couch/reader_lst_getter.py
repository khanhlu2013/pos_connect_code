def exe(db):
	security_doc_id = '_security'
	security_doc = db.get(security_doc_id)
	return security_doc['readers']['names']
	
