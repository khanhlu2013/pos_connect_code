var env = require('./environment.js');
var request = require('request');

module.exports = {

    api_receipt:{
        edit_date : function(receipt,delta_date){
            return browser.executeAsyncScript(function(receipt,delta_date,callback){
                function _subtract_date_base_on_qty(receipt,delta_date,offline_db,$q,receipt_storage_adapter){
                    var defer = $q.defer();
                    var new_date = new Date(receipt.date);
                    new_date.setDate(new_date.getDate() + delta_date)
                    receipt.date = new_date;
                    offline_db.put(receipt_storage_adapter.javascript_2_pouch(receipt),receipt.doc_id,receipt.doc_rev).then(
                        function(response){
                            defer.resolve(response);
                        },function(reason){
                            defer.reject(reason);
                        }
                    )
                    return defer.promise;
                }   

                var offline_receipt_api = angular.injector(['ng','model.receipt']).get('model.receipt.rest_offline');
                var offline_db_util = angular.injector(['ng','share.offline_db_util']).get('share.offline_db_util');
                var offline_db = offline_db_util.get();
                var $q = angular.injector(['ng']).get('$q');
                var receipt_storage_adapter = angular.injector(['ng','model.receipt']).get('model.receipt.receipt_storage_adapter');
                offline_receipt_api.get_item(receipt.doc_id).then(
                    function(receipt){
                        _subtract_date_base_on_qty(receipt,delta_date,offline_db,$q,receipt_storage_adapter).then(
                            function(){
                                callback();
                            }
                        )
                    }
                );
            },receipt,delta_date);
        },
        get_lst : function(){
            return browser.executeAsyncScript(function(callback){
                var offline_receipt_api = angular.injector(['ng','model.receipt']).get('model.receipt.rest_offline');
                var offline_db_util = angular.injector(['ng','share.offline_db_util']).get('share.offline_db_util');
                var offline_db = offline_db_util.get();
                var $q = angular.injector(['ng']).get('$q');
                var receipt_storage_adapter = angular.injector(['ng','model.receipt']).get('model.receipt.receipt_storage_adapter');
                offline_receipt_api.get_receipt_lst().then(
                    function(receipt_lst){
                        callback(receipt_lst);
                    }
                );
            });
        }
    },
    api_group:{
        insert_empty_group : function(group_name){
            return browser.executeAsyncScript(function(group_name,callback) {
                var api = angular.injector(['ng','share.util.csrf','model.group']).get('model.group.rest');
                var empty_group = {name:group_name,sp_lst:[]};
                api.create(empty_group).then(
                     function(group){ callback(group); }
                    ,function(reason){ callback(null); }
                )
            },group_name)            
        },
        edit_group : function(group){
            return browser.executeAsyncScript(function(group,callback) {
                var api = angular.injector(['ng','share.util.csrf','model.group']).get('model.group.rest');
                api.edit_item(group,group.id).then(
                     function(edited_group){ callback(edited_group); }
                    ,function(reason){ callback(null); }
                )
            },group)              
        }
    },
    api_pt:{
        insert_lst : function(pt_name_lst){
            return browser.executeAsyncScript(function(pt_name_lst,callback) {
                var api = angular.injector(['ng','share.util.csrf','model.payment_type']).get('model.payment_type.rest');
                var $q = angular.injector(['ng']).get('$q');
                var Payment_type = angular.injector(['model.payment_type']).get('model.payment_type.Payment_type');
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
        insert_mm : function(name,price,is_include,qty,sp_lst,is_disable){
            var mm = 
            {
                 name:name
                ,mm_price:price
                ,is_include_crv_tax:is_include
                ,qty:qty
                ,sp_lst:sp_lst
                ,is_disable:is_disable
            };     
            var data = { mm : mm };
            return browser.executeAsyncScript(function(data,callback) {
                var api = angular.injector(['ng','share.util.csrf','model.mix_match']).get('model.mix_match.rest');
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
                var api = angular.injector(['ng','share.util.csrf','model.store_product']).get('model.store_product.rest_crud');
                api.insert_new(data.sp,data.sku).then(
                    function(res){
                        callback(res);
                    } 
                )
            },data)
        },
        insert_old : function(product_id,sku,name,price,value_customer_price,crv,is_taxable,is_sale_report,p_type,p_tag,cost,vendor,buydown){
            var sp = this.create_sp_json(name,price,value_customer_price,crv,is_taxable,is_sale_report,p_type,p_tag,cost,vendor,buydown);  
            var data = {product_id:product_id,sku:sku,sp:sp };

            return browser.executeAsyncScript(function(data,callback) {
                var api = angular.injector(['ng','share.util.csrf','model.store_product']).get('model.store_product.rest_crud');
                api.insert_old(data.product_id,data.sku,data.sp).then(function(data){callback(data);});
            },data)
        },
        add_sku : function(product_id,sku){
            var data = {product_id:product_id,sku:sku};
            return browser.executeAsyncScript(function(data,callback){
                var api = angular.injector(['ng','share.util.csrf','model.store_product']).get('model.store_product.rest_sku');
                api.add_sku(data.product_id,data.sku).then(function(data){callback(data);});
            },data)
        },
        update_kit : function(sp){
            return browser.executeAsyncScript(function(sp,callback){
                var api = angular.injector(['ng','share.util.csrf','model.store_product']).get('model.store_product.rest_kit');
                api.update(sp).then(function(updated_sp){callback(updated_sp);});
            },sp)
        }      

    },

    auth: {
        login : function(name,pwrd){
            //get the page.
            browser.driver.get(env.baseUrl);
            browser.driver.isElementPresent(by.id('sale_app/menu/action')).then(
                function(is_present){
                    if(is_present){
                        browser.driver.findElement(by.id('sale_app/menu/action')).click();
                        browser.driver.findElement(by.id('logout_link')).click();
                        browser.driver.findElement(by.id('service/ui/confirm/ok_btn')).click();
                    }
                }
            )

            browser.driver.isElementPresent(by.id('sp_app/menu/action')).then(
                function(is_present){
                    if(is_present){
                        browser.driver.findElement(by.id('sp_app/menu/action')).click();
                        browser.driver.findElement(by.id('logout_link')).click();
                        browser.driver.findElement(by.id('service/ui/confirm/ok_btn')).click();
                    }
                }
            )

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
            // browser.wait(function(){ return element(by.css('.block-ui-overlay')).isDisplayed().then(function(val){ return !val; })});
            browser.wait(function(){ return element(by.css('.block-ui-overlay')).getSize().then(function(size){ return size.height === 0 })});

            browser.driver.isElementPresent(by.id('sale_app/menu/action')).then(
                function(is_present){
                    if(is_present){
                        browser.driver.findElement(by.id('sale_app/menu/action')).click();
                        browser.driver.findElement(by.id('logout_link')).click();
                        browser.driver.findElement(by.id('service/ui/confirm/ok_btn')).click();
                    }
                }
            )

            browser.driver.isElementPresent(by.id('sp_app/menu/action')).then(
                function(is_present){
                    if(is_present){
                        browser.driver.findElement(by.id('sp_app/menu/action')).click();
                        browser.driver.findElement(by.id('logout_link')).click();
                        browser.driver.findElement(by.id('service/ui/confirm/ok_btn')).click();
                    }
                }
            )
        }
    },
    setup:{
        init_data : function(){
            /*
                PRECONDITION: make sure user is already logged in in order to access angular to inject stuff
            */
            browser.executeAsyncScript(function(callback) {
                var $http = angular.injector(['ng','share.util.csrf']).get('$http');
                $http({
                    url:'protractor_test_cleanup',
                    method: 'POST'
                }).then(function(data){callback('init data completed')})
            })
            .then(function (output) { /*console.log(output);*/ });
        }
    },    
    wait_for_block_ui : function(){
        // browser.wait(function(){ return element(by.css('.block-ui-overlay')).isDisplayed().then(function(val){ return !val; })});
        browser.wait(function(){ return element(by.css('.block-ui-overlay')).getSize().then(function(size){ return size.height === 0 })});
    },
    click : function(el){
        // browser.wait(function(){ return element(by.css('.block-ui-overlay')).isDisplayed().then(function(val){ return !val; })});
        browser.wait(function(){ return element(by.css('.block-ui-overlay')).getSize().then(function(size){ return size.height === 0 })});
        el.click();
    },
    currency : function(amount){
        if(amount === null){
            return '';
        }else{
            var result = '$' + amount.toFixed(2);
            if(amount < 0){
                result = '(' + result + ')';
            }
            return result;
        }
    },
    get_global_setting : function(){
        browser.executeAsyncScript(function(callback){
            var global_setting_service = angular.injector(['ng','share.util.global_setting']).get('share.util.global_setting');
            global_setting_service.refresh().then(
                function(global_setting){
                    callback(global_setting);
                }
            )   
        })
    }
};