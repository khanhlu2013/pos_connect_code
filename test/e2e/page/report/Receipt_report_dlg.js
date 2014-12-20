var base_path = './../../';
var lib = require(base_path + 'lib');

var Report_dlg = function () {
    var receipt_lst = element.all(by.repeater('receipt in receipt_lst | orderBy:\'-date\''));
    var receipt_ln_lst = element.all(by.repeater('receipt_ln in $parent.cur_receipt.receipt_ln_lst | orderBy:\'date\''));

    this.control_panel = element(by.id('receipt_app/service/report/control_panel'));

    var get_receipt_col = function(col_name){
        if(col_name === 'time')         { return 0; }
        else if(col_name === 'total')   { return 1; }
        else if(col_name === 'info')    { return 2; }
        else                            { return null; }
    }
    var get_receipt_ln_col = function(col_name){
        if(col_name === 'qty')          { return 0; }
        else if(col_name === 'product') { return 1; }
        else if(col_name === 'price')   { return 2; }
        else                            { return null; }
    }

    this.receipt = {
         lst : receipt_lst
        ,get_col:function(index,col_name){
            var col_index = get_receipt_col(col_name);
            return receipt_lst.get(index).all(by.tagName('td')).get(col_index).getText();
        }
        ,click_col:function(index,col_name){
            var col_index = get_receipt_col(col_name);
            lib.click(receipt_lst.get(index).all(by.tagName('td')).get(col_index));    
        }
        ,summary : {
            get_tender_lbl:function(pt_id){
                return element(by.id('receipt_app/service/report/receipt_summary/tender_lbl/' + pt_id)).getText();       
            }
            ,get_tender_value:function(pt_id){
                return element(by.id('receipt_app/service/report/receipt_summary/tender_value/' + pt_id)).getText();       
            }
            ,buydown_tax_lbl : element(by.id('receipt_app/service/report/receipt_summary/buydown_tax'))
            ,crv_lbl : element(by.id('receipt_app/service/report/receipt_summary/crv'))
            ,saving_lbl : element(by.id('receipt_app/service/report/receipt_summary/saving'))
            ,subtotal_derivation_lbl : element(by.id('receipt_app/service/report/receipt_summary/subtotal_derivation'))    
            ,change_lbl : element(by.id('receipt_app/service/report/receipt_summary/change'))   
            ,change_receipt_tender_btn : element(by.id('receipt_app/service/report/receipt_summary/change_receipt_tender_btn'))   
        }           
    }

    this.receipt_ln = {
        lst : receipt_ln_lst
        ,get_col:function(index,col_name){
            var col = get_receipt_ln_col(col_name);
            return receipt_ln_lst.get(index).all(by.tagName('td')).get(col).getText();
        }
        ,click_col:function(index,col_name){
            var col = get_receipt_ln_col(col_name);
            lib.click(receipt_ln_lst.get(index).all(by.tagName('td')).get(col));
        }  
    }
    
    //btn
    this.exit_btn = element(by.id('receipt_app/service/report/exit_btn'));
    this.today_report_btn = element(by.id('receipt_app/service/report/today_report_btn'));

    //function btn
    this.exit = function(){ lib.click(this.exit_btn); }
    this.today_report = function() { lib.click(this.today_report_btn); }
}

module.exports = new Report_dlg();