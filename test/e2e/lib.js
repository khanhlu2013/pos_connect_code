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
            browser.driver.findElement(by.id('id_username')).sendKeys(name);
            browser.driver.findElement(by.id('id_password')).sendKeys(pwrd);
            browser.driver.findElement(by.id('login_btn')).click();        
        },
        logout : function(){
            protractor.getInstance().sleep(500); //black magic code to wait for backdrop (if exist) to clear before we can click logout link
            browser.findElement(by.id('logout_link')).click();
        }
    },

    api:{
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

            browser.executeAsyncScript(function(data,callback) {
                var api = angular.injector(['ng','sp_app/service/api_crud','store_product_app']).get('sp_app/service/api_crud');
                api.insert_new(data.sp,data.sku).then( function(data){ callback(data);} )
            },data)
            .then(function (output) { /*console.log(output);*/ });
        },

        insert_old : function(){
            var sp = this.create_sp_json(name);  
            var data = { sp:sp,sku:sku };

            browser.executeAsyncScript(function(data,callback) {
                var api = angular.injector(['ng','sp_app/service/api_crud','store_product_app']).get('sp_app/service/api_crud');
                api.insert_new(data.sp,data.sku).then( function(data){ callback(data);} )
            },data)
            .then(function (output) { /*console.log(output);*/ });            
        }
    },

    setup:{
        init_data : function(){
            /*
                PRECONDITION: make sure user is already logged in in order to access angular to inject stuff
            */
            browser.executeAsyncScript(function(callback) {
                var $http = angular.injector(['ng','store_product_app']).get('$http');
                $http({
                    url:'protractor_test_cleanup',
                    method: 'POST'
                }).then(function(data){callback('init data completed')})
            })
            .then(function (output) { /*console.log(output);*/ });
        }
    }
};