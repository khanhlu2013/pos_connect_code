define(
    [
         'lib/async'
        ,'app/receipt/receipt_inserter'
        ,'lib/object_store/get_os'
        ,'lib/number/number'
        ,'app/sale/displaying_scan/displaying_scan_util'
        ,'app/sale/voider/voider'
        ,'app/sale/displaying_scan/displaying_scan_lst_getter'
        ,'app/sale/tender/tender_manage_ui'
    ]
    ,function
    (
         async
        ,receipt_inserter
        ,get_os
        ,number
        ,ds_util
        ,voider
        ,ds_lst_getter
        ,tender_manage_ui
    )
{
    var MM_LST = null;
    
    return function(mm_lst,store_pdb,store_idb,tax_rate,tender_lst,callback){
        MM_LST = mm_lst;

        var ds_lst_getter_b = ds_lst_getter.bind(ds_lst_getter,tax_rate,MM_LST,store_idb);
        async.waterfall([ds_lst_getter_b],function(error,result){
            if(error){
                callback(error);
                return;
            }
            var ds_lst = result;
            if(ds_lst.length == 0){
                callback('scan list is empty');
                return;
            }

            var tender_amount = tender_manage_ui.get_total_tender(tender_lst);
            var line_total = ds_util.get_line_total(ds_lst,tax_rate);
            if(line_total > tender_amount){
                callback('should collect at least ' + line_total/*error*/);
                return;
            }

            var receipt_inserter_b = receipt_inserter.bind(receipt_inserter,store_pdb,ds_lst,tax_rate,tender_lst);
            var voider_b = voider.bind(voider,store_idb);
            async.waterfall([receipt_inserter_b,voider_b],function(error,result){
                callback(error);
            });  
        });
    }
});