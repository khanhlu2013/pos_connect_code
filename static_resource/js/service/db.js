define(
[
     'angular'
    ,'pouchdb_raw'
    // ,'pouchdb_quick_search'
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
            // var obj = {'search':pouchdb_quick_search};
            // PouchDB.plugin(obj);
            return new PouchDB(db_name);            
        }
    }]);

    mod.factory('service/db/get_local_and_remote_doc_count',['$rootScope','$q',function($rootScope,$q){
        return function(){
            var defer = $q.defer();

            //local db
            var store_id = $rootScope.GLOBAL_SETTING.store_id;
            var db_name = $rootScope.GLOBAL_SETTING.store_db_prefix + store_id;
            var local_db = new PouchDB(db_name);

            //remote db
            var source_url = $rootScope.GLOBAL_SETTING.couch_server_url + '/' + db_name;
            var remote_db = new PouchDB(source_url);

            var promise_lst = []
            promise_lst.push(local_db.info());
            promise_lst.push(remote_db.info());
            $q.all(promise_lst).then(
                 function(response_lst){ 
                    defer.resolve({local:response_lst[0].doc_count,remote:response_lst[1].doc_count}); 
                }
                ,function(reason){
                    defer.reject(reason);
                }
            )

            return defer.promise;
        }
    }]);

    mod.factory('service/db/sync',
    [
         '$q'
        ,'$rootScope'
        ,'blockUI'
        ,'service/db/get_local_and_remote_doc_count'
    ,function(
         $q
        ,$rootScope
        ,blockUI
        ,get_local_and_remote_doc_count
    ){
        return function(){
            var defer = $q.defer();
            var store_id = $rootScope.GLOBAL_SETTING.store_id;
            var db_name = $rootScope.GLOBAL_SETTING.store_db_prefix + store_id;
            var local_db = new PouchDB(db_name);
            var source_url = $rootScope.GLOBAL_SETTING.couch_server_url + '/' + db_name;

            blockUI.start('syncing database ...');
            console.log('begin syncing for store_id: ' + store_id);

            PouchDB.replicate(source_url, local_db/*target*/, {batch_size:200 ,batches_limit:10 })
                .on('change', function (info) {
                    $rootScope.$apply(function()  {
                        // var message = 'docs_read: ' + info.docs_read + ', docs_written: ' + info.docs_written + ', doc_write_failures: ' + info.doc_write_failures;
                        var message = info.docs_written + ' products synced';
                        blockUI.message(message);
                    });                            
                })
                .on('complete', function (info) {
                    get_local_and_remote_doc_count().then(
                        function(response){
                            // $rootScope.$apply(function()  {
                            //     defer.resolve(response);
                            //     blockUI.stop();  
                            // }); 
                            defer.resolve(response);
                            blockUI.stop();                            
                        }
                        ,function(reason){
                            $rootScope.$apply(function()  {
                                defer.reject(reason);
                                blockUI.stop();  
                            }); 
                        }
                    )
                })
                .on('error', function (err) {
                    $rootScope.$apply(function()  {
                        var message = 'there is sync error: ' + err;
                        defer.reject(message);
                        blockUI.stop();
                    });                     
                });

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

    mod.factory('service/db/remove_doc',
    [
         '$q'
        ,'service/db/get'
    ,function(
         $q
        ,get_pouch_db
    ){
        return function(doc_id){
            var defer = $q.defer();

            var db = get_pouch_db();
            db.get(doc_id).then(
                 function(doc) { 
                    db.remove(doc).then(
                         function(response){ defer.resolve(response); }
                        ,function(reason){ defer.reject(reason); }
                    )
                }
                ,function(reason){ defer.reject(reason); }
            );              
            
            return defer.promise;
        }
    }])    
})