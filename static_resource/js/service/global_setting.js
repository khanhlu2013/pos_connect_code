/*
    define a service to setup GLOBAL_SETTING in $rootScope. when we use this module for both sale and product page, these page will have the same GLOBAL_SETTING in 
    $rootScope. This uniform make it easy for share code that setup setting to work. This uniform also make it simpler in both page to have the same settings eventhough 
    we might not need some settings in some page, or in any page. 

    _TODO_ for setting that never need in any page, we don't need to store it in GLOBAL_SETTING such as shortcut.
*/

define(
[
     'angular'
    //--------
    ,'model/mix_match/model'
]
,function
(
    angular
)
{
    var mod = angular.module('service/global_setting',
    [
        'mix_match/model'
    ]);

    mod.factory('service/global_setting',
    [
         '$rootScope'
        ,'$q'
        ,'$http'
        ,'mix_match/model/Mix_match'
    ,function(
         $rootScope
        ,$q 
        ,$http
        ,Mix_match
    ){
        function _get_partial_url(static_url){
            var network_product_url = static_url + '/partial/product_app/network_product/'
            var result =
            {
                product:
                {
                    network_product : 
                        {
                             index : network_product_url + 'index.html'
                            ,summary : network_product_url + 'summary.html'
                            ,detail : network_product_url + 'detail.html'
                        }
                }
            }
            return result;
        }

        function set(global_setting){
            //django template auto convert json string into json. but when we ajax to get setting, the response data.data is an object with value to key is of type string. so we need to parse here
            if(typeof(global_setting.MIX_MATCH_LST) === 'string'){
                global_setting.MIX_MATCH_LST = JSON.parse(global_setting.MIX_MATCH_LST)
            }
            if(typeof(global_setting.PAYMENT_TYPE_LST) === 'string'){
                global_setting.PAYMENT_TYPE_LST = JSON.parse(global_setting.PAYMENT_TYPE_LST)
            }
            if(typeof(global_setting.SHORTCUT_LST) === 'string'){
                global_setting.SHORTCUT_LST = JSON.parse(global_setting.SHORTCUT_LST)
            }                        
            $rootScope.GLOBAL_SETTING = {
                 store_id :                     global_setting.STORE_ID
                ,tax_rate :                     global_setting.TAX_RATE
                ,couch_server_url:              global_setting.COUCH_SERVER_URL       
                ,store_db_prefix:               global_setting.STORE_DB_PREFIX
                ,mix_match_lst :                global_setting.MIX_MATCH_LST.map(Mix_match.build)
                ,payment_type_lst:              global_setting.PAYMENT_TYPE_LST
                ,shortcut_lst:                  global_setting.SHORTCUT_LST
                ,shortcut_row_count:            global_setting.SHORTCUT_ROW_COUNT
                ,shortcut_column_count:         global_setting.SHORTCUT_COLUMN_COUNT
                ,store_product_document_type:   global_setting.STORE_PRODUCT_DOCUMENT_TYPE
                ,receipt_document_type:         global_setting.RECEIPT_DOCUMENT_TYPE
                ,static_url:                    global_setting.STATIC_URL
                ,partial_url:                   _get_partial_url(global_setting.STATIC_URL)
                ,max_receipt_snooze_1:          30
                ,max_receipt_snooze_2:          60
                ,max_receipt:                   200                                   
            }

            delete global_setting;
        }
        function refresh(){
            var defer = $q.defer();

            $http({
                url:'/get_global_setting',
                method:'GET',
            }).then(
                function(data){
                    var global_setting = data.data;
                    set(global_setting);
                    defer.resolve(global_setting);
                },function(reason){
                    defer.reject(reason);
                }
            )
            return defer.promise;            
        }
        return {
             set: set
            ,refresh: refresh
        }   
    }])
})