def exe(store):
    exe_master(store)
    exe_couch(store)

def exe_master(store):
    store.save(by_pass_cm=True)

def exe_couch(store):
	pass#store info is not saved in couch