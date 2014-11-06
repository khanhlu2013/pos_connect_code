var base_path = './../../';
var lib = require(base_path + 'lib');

var Execute_dlg = function () {

    //btn
    this.ok_btn = element(by.id('group_app/service/execute/ok_btn'));
    this.exit_btn = element(by.id('group_app/service/execute/exit_btn'));

    //execute field
    this.price_txt = element(by.id('group_app/service/execute/price_txt'));
    this.crv_txt = element(by.id('group_app/service/execute/crv_txt'));
    this.is_taxable_check = element(by.id('group_app/service/execute/is_taxable_check'));
    this.cost_txt = element(by.id('group_app/service/execute/cost_txt'));
    this.is_sale_report_check = element(by.id('group_app/service/execute/is_sale_report_check'));
    this.p_type_txt = element(by.id('group_app/service/execute/p_type_txt'));
    this.p_tag_txt = element(by.id('group_app/service/execute/p_tag_txt'));
    this.vendor_txt = element(by.id('group_app/service/execute/vendor_txt'));
    this.buydown_txt = element(by.id('group_app/service/execute/buydown_txt'));
    this.value_customer_price_txt = element(by.id('group_app/service/execute/value_customer_price_txt'));

    //enable field
    this.enable_price_check = element(by.id('group_app/service/execute/enable_price_check'));
    this.enable_crv_check = element(by.id('group_app/service/execute/enable_crv_check'));
    this.enable_is_taxable_check = element(by.id('group_app/service/execute/enable_is_taxable_check'));
    this.enable_cost_check = element(by.id('group_app/service/execute/enable_cost_check'));
    this.enable_is_sale_report_check = element(by.id('group_app/service/execute/enable_is_sale_report_check'));
    this.enable_p_type_check = element(by.id('group_app/service/execute/enable_p_type_check'));
    this.enable_p_tag_check = element(by.id('group_app/service/execute/enable_p_tag_check'));
    this.enable_vendor_check = element(by.id('group_app/service/execute/enable_vendor_check'));
    this.enable_buydown_check = element(by.id('group_app/service/execute/enable_buydown_check'));
    this.enable_value_customer_price_check = element(by.id('group_app/service/execute/enable_value_customer_price_check'));

    //label
    this.empty_group_warning_lbl = element(by.id('group_app/service/execute/empty_group_warning_lbl'));

    //function btn
    this.exit = function(){ lib.click(this.exit_btn);}
    this.ok = function(){ lib.click(this.ok_btn);}

    //function checkbox
    this.enable_field = function(field,set_val){
        var checkbox = null;
        if(field === 'price')                       { checkbox = this.enable_price_check; }
        else if(field === 'crv')                    { checkbox = this.enable_crv_check; }
        else if(field === 'is_taxable')             { checkbox = this.enable_is_taxable_check; }
        else if(field === 'cost')                   { checkbox = this.enable_cost_check; }
        else if(field === 'is_sale_report')         { checkbox = this.enable_is_sale_report_check; }
        else if(field === 'p_type')                 { checkbox = this.enable_p_type_check; }
        else if(field === 'p_tag')                  { checkbox = this.enable_p_tag_check; }
        else if(field === 'vendor')                 { checkbox = this.enable_vendor_check; }
        else if(field === 'buydown')                { checkbox = this.enable_buydown_check; }
        else if(field === 'value_customer_price')   { checkbox = this.enable_value_customer_price_check; }

        checkbox.isSelected().then( function(val){ if(set_val !== val){ lib.click(checkbox); } } );
    }

    //function textbox
    this.set_field = function(field,set_val){
        //textbox
        var textbox = null;
        if(field === 'price')                       { textbox = this.price_txt; }
        else if(field === 'crv')                    { textbox = this.crv_txt; }
        else if(field === 'cost')                   { textbox = this.cost_txt; }
        else if(field === 'p_type')                 { textbox = this.p_type_txt; }
        else if(field === 'p_tag')                  { textbox = this.p_tag_txt; }
        else if(field === 'vendor')                 { textbox = this.vendor_txt; }
        else if(field === 'buydown')                { textbox = this.buydown_txt; }
        else if(field === 'value_customer_price')   { textbox = this.value_customer_price_txt; }   
        if(textbox !== null){
            textbox.clear(); textbox.sendKeys(set_val);
        }
        //checkbox
        var checkbox = null;
        if(field === 'is_taxable')                  { checkbox = this.is_taxable_check; }
        else if(field === 'is_sale_report')         { checkbox = this.is_sale_report_check; }
        if(checkbox !== null){
            checkbox.isSelected().then( function(val){ if(set_val !== val){ lib.click(checkbox); } } );
        }
    }
}

module.exports = new Execute_dlg();





