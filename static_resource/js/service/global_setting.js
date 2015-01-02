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
    ,'model/store/model'
]
,function
(
    angular
)
{
    var mod = angular.module('service/global_setting',
    [
         'mix_match/model'
        ,'store/model'
    ]);

    mod.factory('service/global_setting',
    [
         '$rootScope'
        ,'$q'
        ,'$http'
        ,'mix_match/model/Mix_match'
        ,'store/model/Store'
    ,function(
         $rootScope
        ,$q 
        ,$http
        ,Mix_match
        ,Store
    ){
        function _get_partial_url(static_url){
            var network_product_url = static_url + 'partial/product_app/network_product/'
            var result =
            {
                product:
                {
                    network_product: 
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
            /*
                . there are 2 way to get global setting
                    . in django html template. in this case, django auto convert json string into json - i believe with the | safe option
                    . through ajax. In this case, the response data.data is an object with setting property is of type string(unlike django template)

                . due to the mixmatch mention above, this set service will convert global_setting(which can be get though template or ajax) property into json if it is string
            */
            //django template auto convert json string into json. but when we ajax to get setting, the response data.data is an object with value to key is of type string. so we need to parse here

            if(typeof(global_setting.STORE) === 'string'){
                global_setting.STORE = JSON.parse(global_setting.STORE)
            }            
            if(typeof(global_setting.MIX_MATCH_LST) === 'string'){
                global_setting.MIX_MATCH_LST = JSON.parse(global_setting.MIX_MATCH_LST)
            }
            if(typeof(global_setting.PAYMENT_TYPE_LST) === 'string'){
                global_setting.PAYMENT_TYPE_LST = JSON.parse(global_setting.PAYMENT_TYPE_LST)
            }
            if(typeof(global_setting.SHORTCUT_LST) === 'string'){
                global_setting.SHORTCUT_LST = JSON.parse(global_setting.SHORTCUT_LST)
            }                      

            //we then inject these setting into the rootscope 
            $rootScope.GLOBAL_SETTING = {
                 STORE:                         Store.build(global_setting.STORE)
                ,STORE_ID :                     global_setting.STORE_ID
                ,TAX_RATE :                     global_setting.TAX_RATE
                ,COUCH_SERVER_URL:              global_setting.COUCH_SERVER_URL       
                ,STORE_DB_PREFIX:               global_setting.STORE_DB_PREFIX
                ,MIX_MATCH_LST :                global_setting.MIX_MATCH_LST.map(Mix_match.build)
                ,PAYMENT_TYPE_LST:              global_setting.PAYMENT_TYPE_LST
                ,SHORTCUT_LST:                  global_setting.SHORTCUT_LST
                ,SHORTCUT_ROW_COUNT:            global_setting.SHORTCUT_ROW_COUNT
                ,SHORTCUT_COLUMN_COUNT:         global_setting.SHORTCUT_COLUMN_COUNT
                ,STORE_PRODUCT_DOCUMENT_TYPE:   global_setting.STORE_PRODUCT_DOCUMENT_TYPE
                ,RECEIPT_DOCUMENT_TYPE:         global_setting.RECEIPT_DOCUMENT_TYPE
                ,STATIC_URL:                    global_setting.STATIC_URL
                ,PARTIAL_URL:                   _get_partial_url(global_setting.STATIC_URL)
                ,MAX_RECEIPT_SNOOZE_1:          30
                ,MAX_RECEIPT_SNOOZE_2:          60
                ,MAX_RECEIPT:                   200                                   
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