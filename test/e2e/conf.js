var env = require('./environment.js');
var lib = require('./lib');

exports.config = {
     seleniumAddress: env.seleniumAddress
    ,baseUrl: env.baseUrl
    ,onPrepare: function(){}
    ,allScriptsTimeout: 20000
    ,specs: 
    [
        //  './sp_app/main_page_name_search.js'                        
        // ,'./sp_app/main_page_sku_search.js'                          
        
        // ,'./sp_app/service/create/create_ui_test.js'                 
        // './sp_app/service/create/create_ajax_test.js'  

        //-------------------------------------------------

         './group_app/group.spec.js'  
        ,'./tax_app/tax.spec.js' 
        ,'./payment_type_app/payment_type.spec.js'  
        ,'./shortcut_app/shortcut.setup.spec.js'   
        ,'./mix_match_app/mix_match.spec.js'       

        ,'./sp_app/service/edit/kit.spec.js'    
        ,'./sp_app/service/edit/group.spec.js'  
        ,'./sp_app/service/edit/sku.spec.js'   
        ,'./sp_app/service/edit/main.spec.js'  

        ,'./sale_app/sp_edit/main.spec.js'   
        ,'./sale_app/sp_edit/sku.spec.js'     
        ,'./sale_app/sp_edit/kit.spec.js'     
        ,'./sale_app/sp_edit/group.spec.js'     

        ,'./sale_app/setup_pt.spec.js'      
        ,'./sale_app/sale_finalizer.spec.js'
        ,'./sale_app/sale_able_info_dlg.spec.js'
        ,'./sale_app/hold.spec.js'   
        ,'./sale_app/offline_product.spec.js'
        ,'./sale_app/displaying_scan/non_inventory.spec.js'    
        ,'./sale_app/displaying_scan/tender_calculation_4_single_item.spec.js'
        ,'./sale_app/setup_shortcut.spec.js'  

        ,'./receipt_app/report_offline.spec.js'
        ,'./receipt_app/report_online.spec.js'
        ,'./receipt_app/push.spec.js'

    ]
}