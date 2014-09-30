var base_path = './../../';
var lib = require(base_path + 'lib');

var Tender_dlg = function () {

    //txt
    this.cash_txt = element(by.id('sale_app/service/tender_ui/pt_txt/null'));

    //btn
    this.ok_btn = element(by.id('sale_app/service/tender_ui/ok_btn'));
    this.cancel_btn = element(by.id('sale_app/service/tender_ui/cancel_btn'));

    //table
    this.lst = element.all(by.repeater("pt_tender in pt_lst | orderBy:\'sort\'"));

    // function txt
    this.set_pt = function(pt_id,amount){ element(by.id('sale_app/service/tender_ui/pt_txt/' + pt_id)).sendKeys(amount); }

    //function btn
    this.ok = function(){this.ok_btn.click();}
    this.cancel = function(){this.cancel_btn.click();}

    //function label
    this.get_pt_label_by_index = function(index){ return this.lst.get(index).all(by.tagName('label')).get(0).getText(); }
}   

module.exports = new Tender_dlg();