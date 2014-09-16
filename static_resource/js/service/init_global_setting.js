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
    ,'app/mix_match_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('service/init_global_setting',
    [
        'mix_match_app/model'
    ]);

    mod.factory('service/init_global_setting',
    [
         '$rootScope'
        ,'$window'
        ,'mix_match_app/model/Mix_match'
    ,function(
         $rootScope
        ,$window
        ,Mix_match
    ){
        return function(){
            $rootScope.GLOBAL_SETTING = {
                 store_id :                     $window._STORE_ID_
                ,tax_rate :                     $window._TAX_RATE_
                ,couch_server_url:              $window._COUCH_SERVER_URL_       
                ,store_db_prefix:               $window._STORE_DB_PREFIX_
                ,mix_match_lst :                $window._MIX_MATCH_LST_.map(Mix_match.build)
                ,payment_type_lst:              $window._PAYMENT_TYPE_LST_
                ,shortcut_lst:                  $window._SHORTCUT_LST_
                ,shortcut_row_count:            $window._SHORTCUT_ROW_COUNT_
                ,shortcut_column_count:         $window._SHORTCUT_COLUMN_COUNT_
                ,store_product_document_type:   $window._STORE_PRODUCT_DOCUMENT_TYPE_
                ,receipt_document_type:         $window._RECEIPT_DOCUMENT_TYPE_
            }

            delete $window._STORE_ID_;
            delete $window._TAX_RATE_;
            delete $window._COUCH_SERVER_URL_;  
            delete $window._STORE_DB_PREFIX_;
            delete $window._MIX_MATCH_LST_;
            delete $window._PAYMENT_TYPE_LST_;
            delete $window._SHORTCUT_LST_;
            delete $window._SHORTCUT_ROW_COUNT_;
            delete $window._SHORTCUT_COLUMN_COUNT_;
            delete $window._STORE_PRODUCT_DOCUMENT_TYPE_;
            delete $window._RECEIPT_DOCUMENT_TYPE_;
            
        }   
    }])
})