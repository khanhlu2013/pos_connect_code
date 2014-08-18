var env = require('./environment.js');

exports.config = {
    seleniumAddress: env.seleniumAddress,
    specs: 
    [
        //  './sp_app/main_page_name_search.js'                        //-> fail,work,work,fail,work
        // ,'./sp_app/main_page_sku_search.js'                          //-> fail,work,work
        // ,'./sp_app/service/create/create_ui_test.js'                 //-> fail,work,work
        // ,'./sp_app/service/create/create_ajax_test.js'               //-> fail,fail,work
        // ,'./sp_app/service/edit/sp.js'                               //-> work
        // ,'./sp_app/service/edit/sku.js'     
        // ,'./sp_app/service/edit/group.js'                            //-> work
        // ,'./sp_app/service/edit/kit.js'                              //-> fail,fail,work
        // ,'./group_app/group.js'                                      //-> work,
        // ,'./tax_app/tax.js'                                          //-> work,                       
        './shortcut_app/shortcut.setup.spec.js'                     //-> work
        // ,'./mix_match_app/mix_match.js'                              //-> work
        // ,'./payment_type_app/payment_type.js'                        //-> work

    ],
    baseUrl: env.baseUrl,
    onPrepare: function() {

    }
}
