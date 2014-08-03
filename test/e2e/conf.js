var env = require('./environment.js');

exports.config = {
    seleniumAddress: env.seleniumAddress,
    specs: 
    [
    	//  './sp_app/main_page_name_search.js'
    	// ,'./sp_app/main_page_sku_search.js'
    	'./sp_app/service/create.js'
	],
    baseUrl: env.baseUrl,
    onPrepare: function() {

    }
}
