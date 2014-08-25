module.exports = {
    auth: {
        // findAll: function() {
        //   return browser.executeAsyncScript(function(callback) {
        //     var api = angular.injector(['ProtractorMeetupApp']).get('apiService');
        //     api.member.query({}, function(data) {
        //       callback(data);
        //     });
        //   })
        // },
        // create: function(data) {
        //   return browser.executeAsyncScript(function(data, callback) {
        //     var api = angular.injector(['ProtractorMeetupApp']).get('apiService');
        //     api.member.save(data, function(newItem) {
        //       callback(newItem._id);
        //     })
        //   }, data);
        // }

        login : function(url,name,pwrd){
            //get the page.
            browser.driver.get(url);

            //login
            browser.driver.findElement(by.id('id_username')).clear();
            browser.driver.findElement(by.id('id_username')).sendKeys(name);

            browser.driver.findElement(by.id('id_password')).clear();
            browser.driver.findElement(by.id('id_password')).sendKeys(pwrd);

            browser.driver.findElement(by.id('login_btn')).click();        
        },
        logout : function(){
            protractor.getInstance().sleep(500); //black magic code to wait for backdrop (if exist) to clear before we can click logout link
            browser.findElement(by.id('logout_link')).click();
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
                var api = angular.injector(['ng','service/csrf','sp_app/service/api_sp']).get('sp_app/service/api_sp');
                api.insert_new(data.sp,data.sku).then(function(data){callback(data);} )
            },data)
        },

        insert_old : function(product_id,sku,name,price,value_customer_price,crv,is_taxable,is_sale_report,p_type,p_tag,cost,vendor,buydown){
            var sp = this.create_sp_json(name,price,value_customer_price,crv,is_taxable,is_sale_report,p_type,p_tag,cost,vendor,buydown);  
            var data = {product_id:product_id,sku:sku,sp:sp };

            return browser.executeAsyncScript(function(data,callback) {
                var api = angular.injector(['ng','service/csrf','sp_app/service/api_sp']).get('sp_app/service/api_sp');
                api.insert_old(data.product_id,data.sku,data.sp).then(function(data){callback(data);});
            },data)
        },

        add_sku : function(product_id,sku){
            var data = {product_id:product_id,sku:sku};
            return browser.executeAsyncScript(function(data,callback){
                var api = angular.injector(['ng','service/csrf','sp_app/service/api_sku']).get('sp_app/service/api_sku');
                api.add_sku(data.product_id,data.sku).then(function(data){callback(data);});
            },data)
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

    product_page:{
        get_line_text : function(data){
            return browser.executeAsyncScript(function(data,callback){
                var currencyFilter = angular.injector(['ng']).get('currencyFilter') ;
                var str =
                    data.name +
                    ' ' + currencyFilter(data.price) +
                    (data.crv == null ? "" : (' ' + currencyFilter(data.crv))) +
                    (data.p_type == null ? "" : (' ' + data.p_type)) +
                    (data.p_tag == null ? "" : (' ' + data.p_tag)) +
                    (data.vendor == null ? "" : (' ' + data.vendor)) +
                    (data.cost == null ? "" : (' ' + currencyFilter(data.cost))) +
                    (data.buydown == null ? "" : (' ' + currencyFilter(data.buydown))) +
                    (data.value_customer_price == null ? "" : (' ' + currencyFilter(data.value_customer_price)))
                ;
                callback(str);
            },data);
        }
    },

    sale_page:{
        scan : function(str){
            var ptor = protractor.getInstance();
            var enter_key = protractor.Key.ENTER;            
            var scan_txt = element(by.id('sale_app/main_page/scan_txt'));
            scan_txt.clear();
            scan_txt.sendKeys(str,enter_key);
            ptor.sleep(500);
        }
    },
    
    ui:{
        click : function(element){
            // protractor.getInstance().sleep(1);
            // element.click();


            // element.getLocation().then(function(loc){
            //     protractor.getInstance().executeScript('window.scrollTo(0,' + loc.y + ' );').then(function () {
            //         element.click();
            //     })                
            // })


            // browser.wait(function(){
            //     return element.isPresent();
            // }).then(function(){element.click()})

            element.click();
        }
    }
};