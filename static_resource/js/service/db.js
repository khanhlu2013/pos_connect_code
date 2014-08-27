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
    var mod = angular.module('service/db',['blockUI']);

    mod.factory('service/db/get',['$rootScope',function($rootScope){
        return function(){
            var db_name = $rootScope.GLOBAL_SETTING.store_db_prefix + $rootScope.GLOBAL_SETTING.store_id;
            PouchDB.plugin(pouchdb_quick_search);
            return new PouchDB(db_name);            
        }
    }]);

    mod.factory('service/db/sync',['$q','$rootScope','blockUI',function($q,$rootScope,blockUI){
        return function(store_id/*the benefit of passing store_id here simplify things: we don't need to know where stoer_id comming from*/){
            var defer = $q.defer();
            
            console.log('begin syncing for store_id: ' + store_id);
            blockUI.start();
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
})