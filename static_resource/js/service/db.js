define(
[
     'angular'
    ,'pouchdb_raw'
    ,'pouchdb_quick_search'
    ,'blockUI'    
]
,function
(
     angular
    ,PouchDB
    ,pouchdb_quick_search
)
{
    var MY_STORE_DB_PREFIX = STORE_DB_PREFIX;
    var MY_POUCH_PREFIX = '_pouch_';
    var MY_COUCH_SERVER_URL = COUCH_SERVER_URL;
    var MY_STORE_ID = STORE_ID;
    //-----------------------------------------------------------------------------

    var mod = angular.module('service/db',['blockUI']);

    mod.factory('service/db/get',function(){
        return function(){
            var db_name = MY_STORE_DB_PREFIX + MY_STORE_ID;
            PouchDB.plugin(pouchdb_quick_search);
            return new PouchDB(db_name);            
        }
    });

    mod.factory('service/db/sync',function($q,blockUI){
        return function(store_id/*the benefit of passing store_id here simplify things: we don't need to know where stoer_id comming from*/){
            var defer = $q.defer();
            
            console.log('begin syncing for store_id: ' + store_id);
            blockUI.start();
            var db_name = MY_STORE_DB_PREFIX + store_id;
            var local_db = new PouchDB(db_name);
            var store_db_url = MY_COUCH_SERVER_URL + '/' + db_name;
            local_db.replicate.from(
                 store_db_url
                ,{
                     batch_size:200
                    ,batches_limit:10
                    ,onChange:function(err,res){
                        if(res){console.log('onChange - response - written: ' + res.docs_written + ' docs ...');}
                        else{console.log('onChange - error - written: ' + err.docs_written + ' docs ...');}
                    }
                }
                ,function(error,res){
                    blockUI.stop();
                    if(error){defer.reject(error);console.log('sync is done - error callback: ' + error);}
                    else{defer.resolve(res);console.log('sync is done - response callback: ' + res);}
                }
            );

            return defer.promise;
        }
    });
})