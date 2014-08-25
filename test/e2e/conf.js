var env = require('./environment.js');

exports.config = {
    seleniumAddress: env.seleniumAddress,
    specs: 
    [
        //  './sp_app/main_page_name_search.js'                        
        // './sp_app/main_page_sku_search.js'                          
        // './sp_app/service/create/create_ui_test.js'                 
        // './sp_app/service/create/create_ajax_test.js'               
        './sp_app/service/edit/sp.js'                               
        // './sp_app/service/edit/sku.js'     
        // './sp_app/service/edit/group.js'                            
        // './sp_app/service/edit/kit.js'                              
        // './group_app/group.js'                                      
        // './tax_app/tax.js'                                                                 
        // './shortcut_app/shortcut.setup.spec.js'                     
        // './mix_match_app/mix_match.js'                              
        // './payment_type_app/payment_type.js'                        



        // './sale_app/shortcut_setup_n_usage.spec.js'                        
        // './sale_app/displaying_scan/tender_calculation_4_single_item.spec.js'      

    ],
    baseUrl: env.baseUrl,
    onPrepare: function() {

    }
}
