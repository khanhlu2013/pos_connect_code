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

    // mod.factory('service/db/sync',['$q','$rootScope','blockUI',function($q,$rootScope,blockUI){
    //     return function(){
    //         blockUI.start('syncing database ...');
    //         console.log('begin syncing for store_id: ' + store_id);

    //         var defer = $q.defer();
    //         var store_id = $rootScope.GLOBAL_SETTING.store_id;

    //         var db_name = $rootScope.GLOBAL_SETTING.store_db_prefix + store_id;
    //         var local_db = new PouchDB(db_name);
    //         var source_url = $rootScope.GLOBAL_SETTING.couch_server_url + '/' + db_name;
    //         PouchDB.replicate(source_url, local_db/*target*/, {batch_size:200 ,batches_limit:10 })
    //         // PouchDB.replicate(source_url, local_db/*target*/)
    //             .on('change', function (info) {
    //                 var message = 'docs_read: ' + info.docs_read + ', docs_written: ' + info.docs_written + ', doc_write_failures: ' + info.doc_write_failures;
    //                 blockUI.message(message);
    //                 console.log(message);
    //             })
    //             .on('complete', function (info) {
    //                 blockUI.stop();
    //             })
    //             .on('error', function (err) {
    //                 var message = 'there is sync error: ' + err
    //                 blockUI.message(message);
    //                 console.log(message);
    //             });            

    //         return defer.promise;
    //     }
    // }]);

    mod.factory('service/db/sync',['$q','$rootScope','blockUI',function($q,$rootScope,blockUI){
        return function(){
            var defer = $q.defer();
            var store_id = $rootScope.GLOBAL_SETTING.store_id;
            console.log('begin syncing for store_id: ' + store_id);
            blockUI.start('syncing database ....');
            var db_name = $rootScope.GLOBAL_SETTING.store_db_prefix + store_id;
            var local_db = new PouchDB(db_name);
            var store_db_url = $rootScope.GLOBAL_SETTING.couch_server_url + '/' + db_name;
            local_db.replicate.from(
                 store_db_url
                ,{
                     batch_size:200
                    ,batches_limit:10
                    ,onChange:function(res,err){
                        var message;
                        if(res){ message = 'docs_read: ' + res.docs_read + ', docs_written: ' + res.docs_written + ', doc_write_failures: ' + res.doc_write_failures; }
                        else{ message = 'there is syncing error ' + err; }
                        blockUI.message(message);
                        console.log(message);                        
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