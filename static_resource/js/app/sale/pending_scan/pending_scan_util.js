define(
	[
		'lib/object_store/get_os'
	],
	function
	(
		get_os
	)
{

	function is_str_in_lst(str,lst){
		var return_bool = false;

		for(var i = 0;i<lst.length;i++){
			if(lst[i] === str){
				return_bool = true;
				break;
			}
		}

		return return_bool;
	}

	function get_distinct_doc_id_lst(ps_lst){
		var doc_id_lst = new Array();

		for(var i = 0;i<ps_lst.length;i++)
		{
			var cur_doc_id = ps_lst[i].sp_doc_id;
 			if(cur_doc_id != null && !is_str_in_lst(cur_doc_id,doc_id_lst)){
				doc_id_lst.push(cur_doc_id);
			}
 		}
 		return doc_id_lst;
	}

	function update_ps(store_idb,ps_item,key,callback){
		var ps_os = get_os.get_pending_scan_os(false/*readwrite*/,store_idb);
	    var request = ps_os.put(ps_item,key);
        request.onsuccess = function(event){
            callback(null/*error*/);
        };
        request.onerror = function(event){
            var error = 'error with code: ' + event.target.errorCode;
            callback(error);
        }
	}

	function delete_ps(store_idb,key,callback){
		var ps_os = get_os.get_pending_scan_os(false/*readwrite*/,store_idb);
		var request = ps_os.delete(key);
        request.onsuccess = function(event){
            callback(null/*error*/);                
        };
        request.onerror = function(event){
            var error = 'error with code: ' + event.target.errorCode;
            callback(error);
    	}
	}

	return {
		 get_distinct_doc_id_lst : get_distinct_doc_id_lst
		,delete_ps:delete_ps
		,update_ps:update_ps
	}


});



