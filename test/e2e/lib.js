var env = require('./environment.js');
var request = require('request');

module.exports = {

    // misc:{
    //     wait_for_sync_if_nessesary : function (){
    //         protractor.getInstance().sleep(1000);//an improvement can be made here by may be waiting for the loading css to be gone
    //     }        
    // },
    // sale_page:{
    //     scan : function(str){
    //         var ptor = protractor.getInstance();
    //         var enter_key = protractor.Key.ENTER;            
    //         var scan_txt = element(by.id('sale_app/main_page/scan_txt'));
    //         scan_txt.clear();
    //         scan_txt.sendKeys(str,enter_key);
    //         ptor.sleep(500);
    //     },
    //     load_this_page : function(milisec,is_offline){
    //         var posUrl
    //         if(is_offline)  {posUrl = 'http://127.0.0.1:8000/sale/index_offline_angular';}
    //         else            {posUrl = 'http://127.0.0.1:8000/sale/index_angular';}
    //         browser.get(posUrl);

    //         // browser.wait(function(){
    //         //     return element(by.css('.block-ui-overlay:not(.ng-hide)')).isDisplayed();
    //         // })    
    //         browser.wait(function(){ return element(by.css('.block-ui-overlay')).isDisplayed().then(function(val){ return !val; })});                    
    //     },
    //     get_index : function(col_name){
    //         if(col_name === 'qty')          { return 0; }
    //         else if(col_name === 'name')    { return 1; }
    //         else if(col_name === 'price')   { return 2; }
    //         else if(col_name === 'delete')  { return 3; }
    //     }
    // },
    
    // menu_report_receipt_page:{
    //     get_receipt_index : function(col_name){
    //         if(col_name === 'total'){
    //             return 1;
    //         }else{
    //             return null;
    //         }
    //     },
  
    //     get_receipt_ln_index : function(col_name){
    //         if      (col_name ==='qty')          { return 0; }
    //         else if (col_name ==='product')      { return 1; }
    //         else if (col_name ==='price')        { return 2; }
    //         else                                 { return null; }
    //     }        
    // },

    // product_page:{
    //     get_line_text : function(data){
    //         return browser.executeAsyncScript(function(data,callback){
    //             var currencyFilter = angular.injector(['ng']).get('currencyFilter') ;
    //             var str =
    //                 data.name +
    //                 ' ' + currencyFilter(data.price) +
    //                 (data.crv == null ? "" : (' ' + currencyFilter(data.crv))) +
    //                 (data.p_type == null ? "" : (' ' + data.p_type)) +
    //                 (data.p_tag == null ? "" : (' ' + data.p_tag)) +
    //                 (data.vendor == null ? "" : (' ' + data.vendor)) +
    //                 (data.cost == null ? "" : (' ' + currencyFilter(data.cost))) +
    //                 (data.buydown == null ? "" : (' ' + currencyFilter(data.buydown))) +
    //                 (data.value_customer_price == null ? "" : (' ' + currencyFilter(data.value_customer_price)))
    //             ;
    //             callback(str);
    //         },data);
    //     }
    // },

    // ui:{
    //     wait_for_block_ui : function(){
    //         browser.wait(function(){ return element(by.css('.block-ui-overlay')).isDisplayed().then(function(val){ return !val; })});
    //     },        
    //     // click : function(item){
    //     //     item.click();
    //     // },
    // },

    //------------------------------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------------------------------
    
    api_group:{
        insert_empty_group : function(group_name){
            return browser.executeAsyncScript(function(group_name,callback) {
                var api = angular.injector(['ng','service/csrf','group_app/service/api']).get('group_app/service/api');
                var empty_group = {name:group_name,sp_lst:[]};
                api.create(empty_group).then(
                     function(group){ callback(group); }
                    ,function(reason){ callback(null); }
                )
            },group_name)            
        }
    },
    api_pt:{
        insert_lst : function(pt_name_lst){
            return browser.executeAsyncScript(function(pt_name_lst,callback) {
                var api = angular.injector(['ng','service/csrf','payment_type_app/service/api']).get('payment_type_app/service/api');
                var $q = angular.injector(['ng']).get('$q');
                var Payment_type = angular.injector(['payment_type_app/model']).get('payment_type_app/model/Payment_type');
                var promise_lst = [];
                for(var i = 0;i<pt_name_lst.length;i++){
                    promise_lst.push(api.create(new Payment_type(null/*id*/,pt_name_lst[i]/*name*/,pt_name_lst[i]/*sort*/,true/*active*/)));
                }
                $q.all(promise_lst).then(
                     function(pt_lst){
                        callback(pt_lst);
                    }
                    ,function(reason){
                        callback(null);
                    }
                )
            },pt_name_lst) 
        }
    },
    api:{
        insert_mm : function(name,price,is_include,qty,sp_lst){
            var mm = 
            {
                name:name,
                mm_price:price,
                is_include_crv_tax:is_include,
                qty:qty,
                sp_lst:sp_lst
            };     
            var data = { mm : mm };
            return browser.executeAsyncScript(function(data,callback) {
                var api = angular.injector(['ng','service/csrf','mix_match_app/service/api']).get('mix_match_app/service/api');
                api.create(data.mm).then(function(data){callback(data);} )
            },data)            
        },
        create_sp_json : function (name,price,value_customer_price,crv,is_taxable,is_sale_report,p_type,p_tag,cost,vendor,buydown){
            return{
                name                    : name                                                                  ,
                price                   : price                 == undefined ? 999.99   : price                 ,
                value_customer_price    : value_customer_price  == undefined ? null     : value_customer_price  ,
                crv                     : crv                   == undefined ? null     : crv                   ,
                is_taxable              : is_taxable            == undefined ? false    : is_taxable            ,
                is_sale_report          : is_sale_report        == undefined ? false    : is_sale_report        ,
                p_type                  : p_type                == undefined ? null     : p_type                ,
                p_tag                   : p_tag                 == undefined ? null     : p_tag                 ,
                cost                    : cost                  == undefined ? null     : cost                  ,
                vendor                  : vendor                == undefined ? null     : vendor                ,
                buydown                 : buydown               == undefined ? null     : buydown
            };
        },
        insert_new : function(sku,name,price,value_customer_price,crv,is_taxable,is_sale_report,p_type,p_tag,cost,vendor,buydown){
            var sp = this.create_sp_json(name,price,value_customer_price,crv,is_taxable,is_sale_report,p_type,p_tag,cost,vendor,buydown);  
            var data = { sp:sp,sku:sku };

            return browser.executeAsyncScript(function(data,callback) {
                var api = angular.injector(['ng','service/csrf','sp_app/service/api/crud']).get('sp_app/service/api/crud');
                api.insert_new(data.sp,data.sku).then(function(data){callback(data);} )
            },data)
        },
        insert_old : function(product_id,sku,name,price,value_customer_price,crv,is_taxable,is_sale_report,p_type,p_tag,cost,vendor,buydown){
            var sp = this.create_sp_json(name,price,value_customer_price,crv,is_taxable,is_sale_report,p_type,p_tag,cost,vendor,buydown);  
            var data = {product_id:product_id,sku:sku,sp:sp };

            return browser.executeAsyncScript(function(data,callback) {
                var api = angular.injector(['ng','service/csrf','sp_app/service/api/crud']).get('sp_app/service/api/crud');
                api.insert_old(data.product_id,data.sku,data.sp).then(function(data){callback(data);});
            },data)
        },
        add_sku : function(product_id,sku){
            var data = {product_id:product_id,sku:sku};
            return browser.executeAsyncScript(function(data,callback){
                var api = angular.injector(['ng','service/csrf','sp_app/service/api/sku']).get('sp_app/service/api/sku');
                api.add_sku(data.product_id,data.sku).then(function(data){callback(data);});
            },data)
        }        
    },

    // -*- DEPROMOTE
    auth: {
        login : function(name,pwrd){
            //get the page.
            browser.driver.get(env.baseUrl);

            //login
            browser.driver.findElement(by.id('id_username')).clear();
            browser.driver.findElement(by.id('id_username')).sendKeys(name);
            browser.driver.findElement(by.id('id_password')).clear();
            browser.driver.findElement(by.id('id_password')).sendKeys(pwrd);
            browser.driver.findElement(by.id('login_btn')).click();

            //wait for the url to be redirect from login into the url we are asking for
            browser.get(env.baseUrl); 
        },
        logout : function(){
            protractor.getInstance().sleep(500); //black magic code to wait for backdrop (if exist) to clear before we can click logout link
            browser.findElement(by.id('logout_link')).click();
        }
    },
    setup:{
        init_data : function(){
            /*
                PRECONDITION: make sure user is already logged in in order to access angular to inject stuff
            */
            browser.executeAsyncScript(function(callback) {
                var $http = angular.injector(['ng','service/csrf']).get('$http');
                $http({
                    url:'protractor_test_cleanup',
                    method: 'POST'
                }).then(function(data){callback('init data completed')})
            })
            .then(function (output) { /*console.log(output);*/ });
        }
    },    
    wait_for_block_ui : function(){
        browser.wait(function(){ return element(by.css('.block-ui-overlay')).isDisplayed().then(function(val){ return !val; })});
    },
    click : function(el){
        browser.wait(function(){ return element(by.css('.block-ui-overlay')).isDisplayed().then(function(val){ return !val; })});
        el.click();
    },
    currency : function(amount){
        var result = '$' + amount.toFixed(2);
        if(amount < 0){
            result = '(' + result + ')';
        }
        return result;
    }

    // setup_test : function(){
    //     var jar = request.jar();
    //     var req = request.defaults({
    //         jar : jar
    //     });
         
    //     function post(url, params) {
    //         var defer = protractor.promise.defer();
    //         console.log("Calling", url);
    //         req.post(browser.baseUrl + url, params, function(error, message) {
    //             console.log("Done call to", url);
    //             if (error || message.statusCode >= 400) {
    //                 defer.reject({
    //                     error : error,
    //                     message : message
    //                 });
    //             } else {
    //                 defer.fulfill(message);
    //             }
    //         });
    //         return defer.promise;
    //     }


    //     function setupCommon() {
    //         return post('protractor_test_cleanup');
    //     }
         
    //     var flow = protractor.promise.controlFlow();
    //     flow.execute(setupCommon);
    // }
    // DEPROMOTE -*-
};