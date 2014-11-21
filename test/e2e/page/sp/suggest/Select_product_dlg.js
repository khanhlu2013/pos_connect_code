var lib = require('./../../../lib');

var Select_product_dlg = function () {

    this.self = element(by.id('sp_app/service/suggest/select_product_dlg'));
    this._is_taxable_sign_span_index = 0;    
    this._is_taxable_percent_span_index = 1;

    //table
    this.lst = element.all(by.repeater("product in product_lst |orderBy:\'-get_sp_lst().length\'"));

    //btn
    this.select_sp_btn = element(by.id('sp_app/service/suggest/select_product_dlg/select_sp'));
    this.create_new_product_btn = element(by.id('sp_app/service/suggest/select_product_dlg/create_new_product_btn'))

    //function table
    this.get_index = function(col_name){
        if(col_name === 'store_count'){ return 0;}
        else if(col_name === 'name'){ return 1;}
        else if(col_name === 'price'){ return 2;}
        else if(col_name === 'crv'){ return 3;}
        else if(col_name === 'is_taxable'){ return 4;}
        else if(col_name === 'cost'){ return 5;}
        else if(col_name === 'add'){ return 6;}
        else { return null; }
    }
    this.click_col = function(index,col_name){
        var col_index = this.get_index(col_name);
        lib.click(this.lst.get(index).all(by.tagName('td')).get(col_index));
    }
    this.get_col = function(index,col_name){
        if(col_name === 'is_taxable'){
            var defer = protractor.promise.defer();
            var col_index = this.get_index(col_name);
            var e = this.lst.get(index).all(by.tagName('td')).get(col_index).all(by.tagName('span')).get(this._is_taxable_sign_span_index)
            e.isDisplayed().then(
                function(is_display){
                    if(is_display){
                        e.getAttribute('class').then(
                            function(cls){
                                if(cls.indexOf('glyphicon-check') !== -1){
                                    defer.fulfill(true);
                                }else{
                                    defer.fulfill(false);
                                }
                            }
                        )
                    }else{
                        defer.fulfill(null)
                    }
                }
            )
            return defer.promise;  
        }else{
            var col_index = this.get_index(col_name);
            return this.lst.get(index).all(by.tagName('td')).get(col_index).getText();                
        }
 
    }
    this.get_is_taxable_percent = function(index){
        var defer = protractor.promise.defer();

        var col_index = this.get_index('is_taxable');
        var e = this.lst.get(index).all(by.tagName('td')).get(col_index).all(by.tagName('span')).get(this._is_taxable_percent_span_index);

        e.isDisplayed().then(
            function(is_display){
                if(is_display){
                    e.getText().then(
                        function(txt){
                            defer.fulfill(txt);
                        }
                    )
                }else{
                    defer.fulfill(null);
                }
            }
        )
        return defer.promise;
    }

    //function btn
    this.create_new_product = function(){
        lib.click(this.create_new_product_btn);
    }
    this.select_sp = function(){
        lib.click(this.select_sp_btn);
    }
}

module.exports = new Select_product_dlg();