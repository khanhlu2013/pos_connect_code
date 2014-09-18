define(
[
     'angular'
    ,'pouchdb_raw'
    // ,'lib/pouchdb_quick_search'
    ,'blockUI'    
]
,function
(
     angular
    ,PouchDB
    // ,pouchdb_quick_search
)
{
    var mod = angular.module('service/db',['blockUI']);

    mod.factory('service/db/get',['$rootScope',function($rootScope){
        return function(){
            var db_name = $rootScope.GLOBAL_SETTING.store_db_prefix + $rootScope.GLOBAL_SETTING.store_id;
            // PouchDB.plugin(pouchdb_quick_search);
            return new PouchDB(db_name);            
        }
    }]);

    mod.factory('service/db/sync',['$q','$rootScope','blockUI',function($q,$rootScope,blockUI){
        return function(){
            var defer = $q.defer();
            var store_id = $rootScope.GLOBAL_SETTING.store_id;
            console.log('begin syncing for store_id: ' + store_id);
            blockUI.start('syncing database ...');
            var db_name = $rootScope.GLOBAL_SETTING.store_db_prefix + store_id;
            var local_db = new PouchDB(db_name);
            var store_db_url = $rootScope.GLOBAL_SETTING.couch_server_url + '/' + db_name;
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
    }]);

    mod.factory('service/db/is_pouch_exist',
    [
         '$q'
        ,'$rootScope'
    ,function(
         $q
        ,$rootScope
    ){
        return function(){
            var defer = $q.defer();
            var db_name = '_pouch_' + $rootScope.GLOBAL_SETTING.store_db_prefix + $rootScope.GLOBAL_SETTING.store_id;
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
    }])

    mod.factory('service/db/sync_if_nessesary',
    [
         'service/db/is_pouch_exist'
        ,'service/db/sync'
        ,'$q'
    ,function(
         is_pouch_exist
        ,sync
        ,$q
    ){
        return function(){ 
            var defer = $q.defer();
            is_pouch_exist().then(
                function(db_existance){
                    if(db_existance){
                        sync().then(
                             function(response){defer.resolve(null);}
                            ,function(reason){defer.reject(reason);}
                        )
                    }else{ defer.resolve(null); }
                }
                ,function(reason){ defer.reject(reason);}
            )
            return defer.promise;
        }
    }])
})