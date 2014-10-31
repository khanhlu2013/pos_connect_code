var base_path = './../../';
var lib = require(base_path + 'lib');

var Report_dlg = function () {

    var offline_receipt_lst = element.all(by.repeater('receipt in offline_receipt_lst | orderBy:\'-date\''));
    var offline_receipt_ln_lst = element.all(by.repeater('receipt_ln in cur_offline_receipt.receipt_ln_lst | orderBy:\'date\''));

    var online_receipt_lst = element.all(by.repeater('online_receipt in online_receipt_lst | orderBy:\'-date\''));
    var online_receipt_ln_lst = element.all(by.repeater('receipt_ln in $parent.cur_online_receipt.receipt_ln_lst | orderBy:\'date\''));

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

    this.online = {
        receipt:{
             lst : online_receipt_lst
            ,get_col:function(index,col_name){
                var col_index = get_receipt_col(col_name);
                return online_receipt_lst.get(index).all(by.tagName('td')).get(col_index).getText();
            }
            ,click_col:function(index,col_name){
                if(col_name === 'info'){
                    online_receipt_lst.get(0).all(by.css('.btn')).get(0).click();
                }else{
                    var col_index = get_receipt_col(col_name);
                    lib.click(online_receipt_lst.get(index).all(by.tagName('td')).get(col_index));                    
                }
            }
            ,summary : {
                get_tender_title_lbl:function(pt_id){
                    return element(by.id('receipt_app/service/report/online/receipt_summary/tender_lbl/' + pt_id)).getText();       
                }
                ,get_tender_lbl:function(pt_id){
                    return element(by.id('receipt_app/service/report/online/receipt_summary/tender_txt/' + pt_id)).getText();       
                }
                ,buydown_tax_lbl : element(by.id('receipt_app/service/report/online/receipt_summary/buydown_tax'))
                ,crv_lbl : element(by.id('receipt_app/service/report/online/receipt_summary/crv'))
                ,saving_lbl : element(by.id('receipt_app/service/report/online/receipt_summary/saving'))
                ,subtotal_derivation_lbl : element(by.id('receipt_app/service/report/online/receipt_summary/subtotal_derivation'))    
                ,change_lbl : element(by.id('receipt_app/service/report/online/receipt_summary/change'))   
            }                  
        },
        receipt_ln:{
            lst : online_receipt_ln_lst
            ,get_col:function(index,col_name){
                var col = get_receipt_ln_col(col_name);
                return online_receipt_ln_lst.get(index).all(by.tagName('td')).get(col).getText();
            }
            ,click_col:function(index,col_name){
                var col = get_receipt_ln_col(col_name);
                online_receipt_ln_lst.get(index).all(by.tagName('td')).get(col).click();
            }            
        }
    }
    this.offline = {
        receipt : {
             lst : offline_receipt_lst
            ,get_col:function(index,col_name){
                var col_index = get_receipt_col(col_name);
                return offline_receipt_lst.get(index).all(by.tagName('td')).get(col_index).getText();
            }
            ,click_col:function(index,col_name){
                var col_index = get_receipt_col(col_name);
                offline_receipt_lst.get(index).all(by.tagName('td')).get(col_index).click();
            }
            ,summary : {
                get_tender_title_lbl:function(pt_id){
                    return element(by.id('receipt_app/service/report/offline/receipt_summary/tender_lbl/' + pt_id)).getText();       
                }
                ,get_tender_lbl:function(pt_id){
                    return element(by.id('receipt_app/service/report/offline/receipt_summary/tender_txt/' + pt_id)).getText();       
                }
                ,buydown_tax_lbl : element(by.id('receipt_app/service/report/offline/receipt_summary/buydown_tax'))
                ,crv_lbl : element(by.id('receipt_app/service/report/offline/receipt_summary/crv'))
                ,saving_lbl : element(by.id('receipt_app/service/report/offline/receipt_summary/saving'))
                ,subtotal_derivation_lbl : element(by.id('receipt_app/service/report/offline/receipt_summary/subtotal_derivation'))        
                ,change_lbl : element(by.id('receipt_app/service/report/offline/receipt_summary/change'))           
            }
        }
        ,receipt_ln : {
             lst : offline_receipt_ln_lst
            ,get_col:function(index,col_name){
                var col = get_receipt_ln_col(col_name);
                return offline_receipt_ln_lst.get(index).all(by.tagName('td')).get(col).getText();
            }
            ,click_col:function(index,col_name){
                var col = get_receipt_ln_col(col_name);
                offline_receipt_ln_lst.get(index).all(by.tagName('td')).get(col).click();
            }
        }
    }

    //tab
    this.offline_tab = element(by.id('receipt_app/service/report/tab/offline'));
    this.online_tab = element(by.id('receipt_app/service/report/tab/online'));

    //btn
    this.exit_btn = element(by.id('receipt_app/service/report/exit_btn'));
    this.push_btn = element(by.id('receipt_app/service/report/push_btn'));
    this.today_report_btn = element(by.id('receipt_app/service/report/today_report_btn'));

    //function btn
    this.exit = function(){ lib.click(this.exit_btn); }
    this.push = function(){ lib.click(this.push_btn); }
    this.today_report = function() { lib.click(this.today_report_btn); }

    //function tab
    this.switch_tab = function(tab){
        if(tab === 'online'){ this.online_tab.click(); }
        else if(tab === 'offline'){ this.offline_tab.click(); }
    }
}

module.exports = new Report_dlg();