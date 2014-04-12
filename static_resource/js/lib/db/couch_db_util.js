define(
[
	'lib/db/db_util'
]
,function
(
	db_util
)
{
 	function get_db_url(couch_server_url,store_id){
		return couch_server_url + '/' + db_util.get_store_db_name(store_id);
	}

	function extract_rev(doc){
		return parseInt(doc._rev.split('-')[0]);
	}

	function _doc_comparator(doc1,doc2){

		if(doc2._id == doc1._id){
			return extract_rev(doc2) - extract_rev(doc1)
		}else{

			return (doc2._id > doc1._id ? 1 : -1)
		}
 	}



	function filter_old_rev(doc_lst){
		/*
			DESC: couch_db use multi revision/version for a single doc. index_db use pouch_db/couch_db, we don't care about older revision
			PARAM:
				doc_lst: a list of javascript object that have _id and _rev member
			RETURN: a filtered doc_lst containing latest revision
		*/
		function validate_lst(lst){
			var is_valid = true;
			for(var i = 0;i<lst.length;i++){
				var doc = lst[i];
				if(!doc._id || !doc._rev){
					is_valid = false;
					break;
				}
			}
			return is_valid;
		}
		
		//init
		if(!validate_lst(doc_lst)){
			alert('list contain invalid document');
			return null;
		}

		ret_doc_lst = [];
		doc_lst.sort(_doc_comparator);
		var pre_doc = null;
		
		//filter
		for(var i = 0;i<doc_lst.length;i++){
			var doc = doc_lst[i];
	 		if (pre_doc == null || doc._id!=pre_doc._id){//add to list when: first iterator or subsequence iterator with new id
	 			ret_doc_lst.push(doc)
				pre_doc = doc
	 		}else{
				continue;
			}
		}
 		return ret_doc_lst
	}

	return {
		 filter_old_rev:filter_old_rev
		,get_db_url:get_db_url
	}
});




