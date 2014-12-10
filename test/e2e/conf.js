var env = require('./environment.js');
var lib = require('./lib');

exports.config = {
     seleniumAddress: env.seleniumAddress
    ,baseUrl: env.baseUrl
    ,onPrepare: function(){}
    ,allScriptsTimeout: 60000
    ,specs: 
    [
        //  './sp_app/main_page_name_search.js'                        
        // ,'./sp_app/main_page_sku_search.js'                          
        

        //--------------
        // PRODUCT APP -
        //--------------

            // ------
            // MENU -
            // ------       
                 './group_app/group_crud_in_sp_page.spec.js'  
                ,'./group_app/group_execute_in_sp_page.spec.js'
                ,'./payment_type_app/payment_type.spec.js'  
                ,'./shortcut_app/sale_shortcut.setup.spec.js'   
                ,'./mix_match_app/mix_match_manage_in_sp_page.spec.js'       
                ,'./sp_app/menu/sync.spec.js' 
                ,'./sp_app/menu/tax.spec.js'         

            // -----------------------
            // SKU NOT FOUND HANDLER -
            // ----------------------- 
                ,'./sp_app/service/no_sku_network_suggest/ui/path/no_suggest.spec.js'   
                ,'./sp_app/service/no_sku_network_suggest/ui/path/only_product_suggest.spec.js'   
                ,'./sp_app/service/no_sku_network_suggest/ui/path/only_sp_suggest.spec.js'  
                ,'./sp_app/service/no_sku_network_suggest/ui/path/both_product_n_sp_suggest.spec.js'  
                ,'./sp_app/service/no_sku_network_suggest/ui/select_product_dlg.spec.js'
                ,'./sp_app/service/no_sku_network_suggest/ui/sp_prompt_dlg.spec.js'          
                ,'./sp_app/service/no_sku_network_suggest/ajax.spec.js'  
            
            // ------
            // CRUD -
            // ------ 
                ,'./sp_app/service/edit/kit.spec.js'    
                ,'./sp_app/service/edit/group.spec.js'  
                ,'./sp_app/service/edit/sku.spec.js'   
                ,'./sp_app/service/edit/main.spec.js'  

            // ------
            // MISC -
            // ------ 
                ,'./sp_app/service/Sp_prompt_dlg.duplicate_from.spec.js'
                ,'./sp_app/service/network_product.spec.js'



        //-----------
        // SALE APP -
        //-----------

            // ------
            // CRUD -
            // ------ 
                ,'./sale_app/sp_edit/main.spec.js'   
                ,'./sale_app/sp_edit/sku.spec.js'     
                ,'./sale_app/sp_edit/kit.spec.js'     
                ,'./sale_app/sp_edit/group.spec.js'     

            // ------
            // MENU -
            // ------   
                ,'./sale_app/menu/tax.spec.js'        
                ,'./sale_app/menu/pt.spec.js'
                ,'./sale_app/menu/sale_shortcut.spec.js'
                ,'./sale_app/menu/mix_match_watch_n_refresh_ds.spec.js'  
                ,'./sale_app/menu/group_execute_refresh_ds.spec.js'
                ,'./sale_app/menu/sync.spec.js'  

            // ------
            // MISC -
            // ------ 
                ,'./sale_app/page/change_button.spec.js'
                ,'./sale_app/page/suggest_mm_and_cur_mm_info_on_ds_item.spec.js'
                ,'./sale_app/sale_able_info_dlg.spec.js'
                ,'./sale_app/hold.spec.js'   
                ,'./sale_app/init_db.spec.js'    
                ,'./sale_app/displaying_scan/non_inventory.spec.js'    
                ,'./sale_app/displaying_scan/tender_calculation_4_single_item.spec.js'
                ,'./sale_app/sale_finalizer.spec.js'
                ,'./sale_app/offline_product.spec.js'
                ,'./sale_app/receipt_reminder.spec.js'
                ,'./receipt_app/change_receipt_tender.spec.js'   

            // --------
            // REPORT -
            // -------- 
                ,'./receipt_app/report_online_ui.spec.js'
                ,'./receipt_app/report_offline_ui.spec.js'
          
    ]
}