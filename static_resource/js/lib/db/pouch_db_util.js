define(
	[
		'pouch_db'
	]
	,function
	(
		Pouch_db
	)
{
	function get_store_db(store_id){
		return get_db('liquor_' + store_id)
	}

	function get_db(db_name){
		//222 it is more convenient to pass in a int for the store number. we no longer have ap_db 
		return new Pouch_db(db_name);
	}

	function delete_db(db_name,callback){
		Pouch_db.destroy(db_name,function(error,info){
			callback(error);
		});
	}

	function delete_doc(doc,store_pdb,callback){
		store_pdb.remove(doc,function(error,result){
			callback(error);
		});
	}

	return {
		get_db:get_db,
		delete_db:delete_db,
		delete_doc:delete_doc,
		get_store_db:get_store_db
	}
});
