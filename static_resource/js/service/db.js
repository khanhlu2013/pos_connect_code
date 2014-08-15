define(
[
     'angular'
    ,'pouchdb_raw'
]
,function
(
     angular
    ,PouchDB
)
{
   	var MY_DB_PREFIX = 'liquor_';
   	var MY_POUCH_PREFIX = '_pouch_';
   	var MY_COUCH_SERVER_URL = COUCH_SERVER_URL;
 	//-----------------------------------------------------------------------------

 	var mod = angular.module('service/db',[]);

 	mod.factory('service/db/get',function(){
 		return function(store_id){
    		var db_name = MY_DB_PREFIX + store_id;
    		return new PouchDB(db_name); 			
 		}
 	});

 	mod.factory('service/db/sync',function(){
    	return function(store_id){
    		var db_name = MY_DB_PREFIX + store_id;
    		var local_db = new PouchDB(db_name);
    		var store_db_url = MY_COUCH_SERVER_URL + '/' + db_name;
    		console.log(store_db_url);
 			local_db.replicate.from(
	             store_db_url
	            ,{
	            	 batch_size:200
	            	,batches_limit:10
	            	,onChange:function(err,res){
	            		console.log('syncing: ' + res.docs_written + ' products ...');
	            	}
	            }
	            ,function(error,result){
	            	console.log('sync is done with error callback: ' + error);
	            }
	        );
 		}
    });

    mod.factory('service/db/is_db_exist',function($q){
    	return function(store_id){
    		var defer = $q.defer();
	        var db_name = MY_POUCH_PREFIX + MY_DB_PREFIX + store_id;
	        var request = indexedDB.open(db_name);

	        request.onupgradeneeded = function (e){
	            e.target.transaction.abort();
	            defer.resolve(false);
 			}
	        request.onsuccess = function(e) {
	            defer.resolve(true);
	        }
	        request.onerror = function(e) {
	            if(e.target.error.name == "AbortError"){
	                indexedDB.deleteDatabase(db_name);
	            }else{
	            	defer.reject('error when checking db existance');
	            }
	        }   
	        return defer.promise;
    	}
	})
})