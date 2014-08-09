var env = require('./environment.js');

exports.config = {
    seleniumAddress: env.seleniumAddress,
    specs: 
    [
        //  './sp_app/main_page_name_search.js'
        // ,'./sp_app/main_page_sku_search.js'
        // ,'./sp_app/service/create/create_ui_test.js'
        // ,'./sp_app/service/create/create_ajax_test.js'
        // ,'./sp_app/service/edit/sp.js'     
        // ,'./sp_app/service/edit/sku.js' 
        // ,'./sp_app/service/edit/group.js'    
        // ,'./sp_app/service/edit/kit.js'    
        // ,'./group_app/group.js'
        // ,'./tax_app/tax.js'
        // ,'./shortcut_app/shortcut.js'
        './mix_match_app/mix_match.js'

    ],
    baseUrl: env.baseUrl,
    onPrepare: function() {

    }
}
