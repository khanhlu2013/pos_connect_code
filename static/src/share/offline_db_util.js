var mod = angular.module('share.offline_db_util',[]);
mod.factory('share.offline_db_util',
[
    '$q',
    '$rootScope',
    'share_setting',
    'blockUI',
function(
    $q,
    $rootScope,
    share_setting,
    blockUI 
){
    function get(){
       var db_name = share_setting.STORE_DB_PREFIX + share_setting.STORE_ID;
       return new PouchDB(db_name);           
    }
    function remove_doc(doc_id){
        var defer = $q.defer();

        var db = get();
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
    function is_exist(){
        var defer = $q.defer();
        var db_name = '_pouch_' + share_setting.STORE_DB_PREFIX + share_setting.STORE_ID;
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

    function download_product(is_create_if_local_db_not_exist){
        /*
            return {
                local: the_number_of_local_doc
                remote: the_number_of_remote_doc
                docs_written : pouch_response_docs_written
            }
        */
        var defer = $q.defer();

        if(is_create_if_local_db_not_exist){
            _force_download_product().then(
                function(response){
                    defer.resolve(response);
                },function(reason){
                    defer.reject(reason);
                }
            )
        }else{
            is_exist().then(
                function(is_db_exist){
                    if(is_db_exist){
                        _force_download_product().then(
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

    function _force_download_product(){
        var defer = $q.defer();

        var store_id = 18;
        var db_name = 'liquor_' + store_id;
        var local_db = new PouchDB(db_name);
        var couch_server_url = 'https://' + 'ffireventaiduretrimarril' + ':' + 'O7bnrIIMumwfueNuMat6SnaA' + '@' + 'khanhlu2013ceci.cloudant.com'
        var source_url = couch_server_url + '/' + db_name;

        // var store_id = share_setting.STORE_ID;
        // var db_name = share_setting.STORE_DB_PREFIX + store_id;
        // var local_db = new PouchDB(db_name);
        // var source_url = share_setting.COUCH_SERVER_URL + '/' + db_name;

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
                defer.resolve(info);
                blockUI.stop();   
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

    function get_pouch_view_name(view_name){
        /*
            since couch build all views that are group into one doc (when any of them is query), i 
            want to have each view resign in separate doc so that i can fully LAZY building the view 
            to spread out the work load for smoother user experience. 

            Now, we have multiple doc that each have a separate id and contain 1 view. I also have 
            a convention to name the doc_id as _design/view_name so that the doc id can be calculated
            from the view name. This helper function construct the view name that understood by pouchdb
        */
        return view_name + '/' + view_name;
    }

    return{
        get:get,
        remove_doc : remove_doc,
        is_exist : is_exist,
        download_product : download_product,
        get_pouch_view_name : get_pouch_view_name
    }
}]);










