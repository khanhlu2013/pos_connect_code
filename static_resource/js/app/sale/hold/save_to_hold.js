define(
[
     'lib/error_lib'
    ,'lib/async'
    ,'lib/ajax_helper'
    ,'lib/ui/ui'
    ,'constance'
    ,'app/sale/voider/voider'
    ,'app/sale/displaying_scan/displaying_scan_lst_getter'
]
,function
(
     error_lib
    ,async
    ,ajax_helper
    ,ui
    ,constance
    ,voider
    ,ds_lst_getter
)
{
    var STORE_IDB = null;
    var TAX_RATE = null;
    var MM_LST = null;
    var ERROR_nothing_to_hold = 'ERROR_nothing_to_hold';

    function exe(tax_rate,mm_lst,store_idb,callback){
        STORE_IDB = store_idb;
        TAX_RATE = tax_rate;
        MM_LST = mm_lst;

        var ds_getter_b = ds_lst_getter.bind(ds_lst_getter,TAX_RATE,MM_LST,STORE_IDB);
        async.waterfall([ds_getter_b],function(error,result){
            if(error){
                callback(error);
                return;
            }

            var ds_lst = result;
            if(ds_lst.length == 0){
                callback(ERROR_nothing_to_hold);
                return;
            }

            ui.ui_confirm(
                'hold current list?',
                function(){
                    //GET CURRENT HOLD LIST
                    var hold_lst = [];
                    var json_str = localStorage.getItem(constance.HOLD_LST);
                    if(json_str != null){
                        hold_lst = JSON.parse(json_str);
                    }

                    //SAVE CURRENT HOLD
                    var cur_hold = {date:new Date().getTime(),data:ds_lst};
                    hold_lst.push(cur_hold);
                    localStorage.setItem(constance.HOLD_LST,JSON.stringify(hold_lst))
                    var voider_b = voider.bind(voider,STORE_IDB);
                    async.waterfall([voider_b],function(error,result){
                        callback(error);
                    });                     
                },
                function(){
                    callback('ERROR_CANCEL_');
                }
            );
        });
    }

    return{
        exe:exe,
        ERROR_nothing_to_hold:ERROR_nothing_to_hold
    }
})