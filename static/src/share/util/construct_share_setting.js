var mod = angular.module('share.util.construct_share_setting',[
    'model.mix_match',
    'model.store'
]);
mod.factory('share.util.construct_share_setting',
[
    'model.mix_match.Mix_match',
    'model.store.Store',    
function(
    Mix_match,
    Store
){
    return function(share_setting){
        /*
            . there are 2 way to get global setting
                . in django html template. in this case, django auto convert json string into json - i believe with the | safe option
                . through ajax. In this case, the response data.data is an object with setting property is of type string(unlike django template)

            . due to the mixmatch mention above, this set service will convert share_setting(which can be get though template or ajax) property into json if it is string
        */
        //django template auto convert json string into json. but when we ajax to get setting, the response data.data is an object with value to key is of type string. so we need to parse here

        if(typeof(share_setting.STORE) === 'string'){
            share_setting.STORE = JSON.parse(share_setting.STORE)
        }            
        if(typeof(share_setting.MIX_MATCH_LST) === 'string'){
            share_setting.MIX_MATCH_LST = JSON.parse(share_setting.MIX_MATCH_LST)
        }
        if(typeof(share_setting.PAYMENT_TYPE_LST) === 'string'){
            share_setting.PAYMENT_TYPE_LST = JSON.parse(share_setting.PAYMENT_TYPE_LST)
        }
        if(typeof(share_setting.SHORTCUT_LST) === 'string'){
            share_setting.SHORTCUT_LST = JSON.parse(share_setting.SHORTCUT_LST)
        }                      

        var result = 
        {
            STORE:                         Store.build(share_setting.STORE),
            STORE_ID :                     share_setting.STORE_ID,
            TAX_RATE :                     share_setting.TAX_RATE,
            COUCH_SERVER_URL:              share_setting.COUCH_SERVER_URL,       
            STORE_DB_PREFIX:               share_setting.STORE_DB_PREFIX,
            MIX_MATCH_LST :                share_setting.MIX_MATCH_LST.map(Mix_match.build),
            PAYMENT_TYPE_LST:              share_setting.PAYMENT_TYPE_LST,
            SHORTCUT_LST:                  share_setting.SHORTCUT_LST,
            SHORTCUT_ROW_COUNT:            share_setting.SHORTCUT_ROW_COUNT,
            SHORTCUT_COLUMN_COUNT:         share_setting.SHORTCUT_COLUMN_COUNT,
            STORE_PRODUCT_DOCUMENT_TYPE:   share_setting.STORE_PRODUCT_DOCUMENT_TYPE,
            RECEIPT_DOCUMENT_TYPE:         share_setting.RECEIPT_DOCUMENT_TYPE,
            STATIC_URL:                    share_setting.STATIC_URL,
            MAX_RECEIPT_SNOOZE_1:          30,
            MAX_RECEIPT_SNOOZE_2:          60,
            MAX_RECEIPT:                   200,
            VIEW_BY_PRODUCT_ID:            share_setting.VIEW_BY_PRODUCT_ID,
            VIEW_BY_SKU:                   share_setting.VIEW_BY_SKU,
            VIEW_BY_D_TYPE:                share_setting.VIEW_BY_D_TYPE,
        }        
        return result;
    }
}])