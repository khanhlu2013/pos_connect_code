define(
	[
		 'pouch_db'
		,'lib/db/db_util'
	]
	,function
	(
		 Pouch_db
		,db_util
	)
{
	function get_store_db(store_id){
		var db_name = db_util.get_store_db_name(store_id);
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
		delete_db:delete_db,
		delete_doc:delete_doc,
		get_store_db:get_store_db
	}
});
