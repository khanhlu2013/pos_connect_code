var base_path = './../../';
var lib = require(base_path + 'lib');

var Tender_dlg = function () {

    //label
    this.due_lbl = element(by.id('sale_app/service/tender_ui/due_lbl'));

    //txt
    this.cash_txt = element(by.id('sale_app/service/tender_ui/pt_txt/null'));

    //btn
    this.ok_btn = element(by.id('sale_app/service/tender_ui/ok_btn'));
    this.cancel_btn = element(by.id('sale_app/service/tender_ui/cancel_btn'));

    //table
    this.lst = element.all(by.repeater("pt_tender in pt_lst | orderBy:\'sort\'"));

    // function txt
    this.set_pt_value = function(pt_id,amount){ 
        element(by.id('sale_app/service/tender_ui/pt_txt/' + pt_id)).clear(); 
        element(by.id('sale_app/service/tender_ui/pt_txt/' + pt_id)).sendKeys(amount); 
    }

    //function btn
    this.ok = function(){ 
        lib.click(this.ok_btn); 
    }
    this.cancel = function(){ 
        lib.click(this.cancel_btn); 
    }

    //function label
    this.get_pt_label_by_index = function(index){ 
        return this.lst.get(index).all(by.tagName('label')).get(0).getText(); 
    }
    this.get_pt_label = function(pt_id){
        return element(by.id('sale_app/service/tender_ui/pt_lbl/' + pt_id )).getText();
    }
    this.get_pt_value = function(pt_id){
        return element(by.id('sale_app/service/tender_ui/pt_txt/' + pt_id )).getAttribute('value');
    }    
}   

module.exports = new Tender_dlg();