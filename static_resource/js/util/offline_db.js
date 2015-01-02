define(
[
     'angular'
    ,'pouchdb_raw'
    ,'blockUI'    
]
,function
(
     angular
    ,PouchDB
)
{
    var mod = angular.module('util/offline_db',
    [
         'blockUI'
    ]);
    var MAX_NUMBER_OF_DOWNLOAD_TRY = 5

    mod.factory('util/offline_db/remove_doc',
    [
         '$q'
        ,'util/offline_db/get'
    ,function(
         $q
        ,get_offline_db
    ){
        return function(doc_id,GLOBAL_SETTING){
            var defer = $q.defer();

            var db = get_offline_db(GLOBAL_SETTING);
            db.get(doc_id).then(
                 function(doc) { 
                    db.remove(doc).then(
                        function(response){ 
                            defer.resolve(response); 
                        }
                        ,function(reason){ 
                            defer.reject(reason); 
                        }
                    )
                }
                ,function(reason){ defer.reject(reason); }
            );              
            
            return defer.promise;
        }
    }])    

    mod.factory('util/offline_db/get',[function(){
        return function(GLOBAL_SETTING){
            var db_name = GLOBAL_SETTING.STORE_DB_PREFIX + GLOBAL_SETTING.STORE_ID;
            return new PouchDB(db_name);            
        }
    }]);
    
    mod.factory('util/offline_db/is_exist',
    [
         '$q'
    ,function(
         $q
    ){
        return function(GLOBAL_SETTING){
            var defer = $q.defer();
            var db_name = '_pouch_' + GLOBAL_SETTING.STORE_DB_PREFIX + GLOBAL_SETTING.STORE_ID;
            var request = indexedDB.open(db_name);

            request.onupgradeneeded = function (e){
                e.target.transaction.abort();
                // defer.resolve(false);
            }
            request.onsuccess = function(e) {
                defer.resolve(true);
            }
            request.onerror = function(e) {
                if(e.target.error.name == "AbortError"){
                    indexedDB.deleteDatabase(db_name);
                    defer.resolve(false);
                }else{
                    defer.reject('error when checking db existance');
                }
            }   
            return defer.promise;
        }        
    }])    

    mod.factory('util/offline_db/download_product',
    [
         '$q'
        ,'util/offline_db/_force_download_product'
        ,'util/offline_db/is_exist'
    ,function(
         $q
        ,_force_download_product
        ,is_offline_db_exist
    ){
        return function(is_force,GLOBAL_SETTING){
            /*
                return {
                    local: the_number_of_local_doc
                    remote: the_number_of_remote_doc
                    docs_written : pouch_response_docs_written
                }
            */
            var defer = $q.defer();

            if(is_force){
                _force_download_product(GLOBAL_SETTING).then(
                    function(response){
                        defer.resolve(response);
                    },function(reason){
                        defer.reject(reason);
                    }
                )
            }else{
                is_offline_db_exist(GLOBAL_SETTING).then(
                    function(is_db_exist){
                        if(is_db_exist){
                            _force_download_product(GLOBAL_SETTING).then(
                                function(response){
                                    defer.resolve(response);
                                },function(reason){
                                    defer.reject(reason);
                                }
                            )
                        }else{
                            defer.resolve(null);
                        }
                    },
                    function(reason){
                        return defer.reject(reason);
                    }
                )
            }
            return defer.promise;
        }
    }]);
    //-----------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------

    mod.factory('util/offline_db/_get_local_and_remote_doc_count',
    [
         '$q'
    ,function(
         $q
    ){
        return function(GLOBAL_SETTING){
            var defer = $q.defer();

            //local db
            var db_name = GLOBAL_SETTING.STORE_DB_PREFIX + GLOBAL_SETTING.STORE_ID;
            var local_db = new PouchDB(db_name);

            //remote db
            var source_url = GLOBAL_SETTING.COUCH_SERVER_URL + '/' + db_name;
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

    mod.factory('util/offline_db/_force_download_product',
    [
         '$q'
        ,'$rootScope'
        ,'blockUI'
        ,'util/offline_db/_get_local_and_remote_doc_count'
    ,function(
         $q
        ,$rootScope
        ,blockUI
        ,_get_local_and_remote_doc_count
    ){
        function _exe(number_of_try,GLOBAL_SETTING){
            /*
                return {
                    local: the_number_of_local_doc
                    remote: the_number_of_remote_doc
                    docs_written : pouch_response_docs_written
                }
            */
            var defer = $q.defer();

            var store_id = GLOBAL_SETTING.STORE_ID;
            var db_name = GLOBAL_SETTING.STORE_DB_PREFIX + store_id;
            var local_db = new PouchDB(db_name);
            var source_url = GLOBAL_SETTING.COUCH_SERVER_URL + '/' + db_name;

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
                    _get_local_and_remote_doc_count(GLOBAL_SETTING).then(
                        function(response){
                            response.docs_written = info.docs_written;
                            if(number_of_try < MAX_NUMBER_OF_DOWNLOAD_TRY && response.remote > response.local){
                                number_of_try += 1;
                                _exe(number_of_try,GLOBAL_SETTING).then(
                                    function(response_again){
                                        defer.resolve(response_again);
                                        blockUI.stop();                                          
                                    },function(reason){
                                        defer.reject(reason);
                                        blockUI.stop();                                          
                                    }
                                )
                            }else{
                                defer.resolve(response);
                                blockUI.stop();                                     
                            }
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

        return function(GLOBAL_SETTING){
            var defer = $q.defer();

            var number_of_try = 0;
            _exe(number_of_try,GLOBAL_SETTING).then(
                function(response){
                    defer.resolve(response);
                },function(reason){
                    defer.reject(reason);
                }
            )

            return defer.promise;
        }
    }]);    
})