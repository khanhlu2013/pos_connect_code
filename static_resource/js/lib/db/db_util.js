define(
[

]
,function
(

)
{
    function pouch_db_name_to_index_db_name(pouch_db_name){
      return '_pouch_' + pouch_db_name;
    }

    function get_store_db_name(store_id){
        return 'liquor_' + store_id
    }

    function is_store_idb_exist(store_id,callback){
        var db_name = pouch_db_name_to_index_db_name(get_store_db_name(store_id));
        var request = indexedDB.open(db_name);

        request.onupgradeneeded = function (e){
            e.target.transaction.abort();
            callback(null/*error*/,null/*result: db is not exist*/)
        }
        request.onsuccess = function(e) {
            callback(null/*error*/,request.result/*result: db is exist*/);
        }
        request.onerror = function(e) {
            if(e.target.error.name == "AbortError"){
                indexedDB.deleteDatabase(db_name);
            }else{
                alert('there is error');
            }
        }   
    }

    return {
         get_store_db_name:get_store_db_name
        ,is_store_idb_exist:is_store_idb_exist 
        ,pouch_db_name_to_index_db_name:pouch_db_name_to_index_db_name
    };
}
);



