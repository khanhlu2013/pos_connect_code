var Report_dlg = function () {

    var offline_receipt_lst = element.all(by.repeater('receipt in offline_receipt_lst | orderBy : \'-date\''));
    var offline_receipt_ln_lst = element.all(by.repeater('receipt_ln in cur_receipt.receipt_ln_lst | orderBy : \'date\''));
    var get_offline_receipt_col = function(col_name){
        if(col_name === 'time')         { return 0; }
        else if(col_name === 'total')   { return 1; }
        else if(col_name === 'info')    { return 2; }
        else                            { return null; }
    }
    var get_offline_receipt_ln_col = function(col_name){
        if(col_name === 'qty')          { return 0; }
        else if(col_name === 'product') { return 1; }
        else if(col_name === 'price')   { return 2; }
        else                            { return null; }
    }

    this.offline = {
        receipt : {
             lst : offline_receipt_lst
            ,get_col:function(index,col_name){
                var col = null;
                if(col_name === 'total'){
                    col = 1;
                }

                return offline_receipt_lst.get(index).all(by.tagName('td')).get(col).getText();
            }
            ,click_col:function(index,col_name){
                if(col_name == 'info'){
                    offline_receipt_lst.get(index).all(by.css('.btn')).get(0).click();
                }  
                else{
                    var col = get_offline_receipt_col(col_name);
                    offline_receipt_lst.get(index).all(by.tagName('td')).get(col).click();
                }
            }
            ,summary : {
                get_tender_title_lbl:function(pt_id){
                    return element(by.id('receipt_app/service/report/receipt_summary/tender_lbl/' + pt_id)).getText();       
                }
                ,get_tender_lbl:function(pt_id){
                    return element(by.id('receipt_app/service/report/receipt_summary/tender_txt/' + pt_id)).getText();       
                }
                ,buydown_tax_lbl : element(by.id('receipt_app/service/report/receipt_summary/buydown_tax'))
                ,crv_lbl : element(by.id('receipt_app/service/report/receipt_summary/crv'))
                ,saving_lbl : element(by.id('receipt_app/service/report/receipt_summary/saving'))
                ,subtotal_derivation_lbl : element(by.id('receipt_app/service/report/receipt_summary/subtotal_derivation'))                
            }
        }
        ,receipt_ln : {
             lst : offline_receipt_ln_lst
            ,get_col:function(index,col_name){
                var col = get_offline_receipt_ln_col(col_name);
                return offline_receipt_ln_lst.get(index).all(by.tagName('td')).get(col).getText();
            }
            ,click_col:function(index,col_name){
                var col = get_offline_receipt_ln_col(col_name);
                offline_receipt_ln_lst.get(index).all(by.tagName('td')).get(col).click();
            }
        }
    }

    //btn
    this.exit_btn = element(by.id('receipt_app/service/report/exit_btn'))

    //function
    this.exit = function(){ this.exit_btn.click(); }
}

module.exports = new Report_dlg();