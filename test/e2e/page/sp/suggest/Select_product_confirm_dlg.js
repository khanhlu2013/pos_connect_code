var lib = require('./../../../lib');

var Select_product_confirm_dlg = function () {

    this.self = element(by.id('sp_app/service/suggest/select_product_confirm_dlg'));

    //btn
    this.ok_btn = element(by.id('sp_app/service/suggest/select_product_confirm_dlg/ok_btn'));

    //btn function
    this.ok = function(){
        lib.click(this.ok_btn);
    }

    this.summary = {
         name_lbl : element(by.id('sp_app/service/suggest/select_product_confirm_dlg/summary/name_lbl'))
        ,price_lbl : element(by.id('sp_app/service/suggest/select_product_confirm_dlg/summary/price_lbl'))
        ,crv_lbl : element(by.id('sp_app/service/suggest/select_product_confirm_dlg/summary/crv_lbl'))
        ,cost_lbl : element(by.id('sp_app/service/suggest/select_product_confirm_dlg/summary/cost_lbl'))
        ,is_taxable :{
             sign_span : element(by.id('sp_app/service/suggest/select_product_confirm_dlg/summary/is_taxable/sign_span'))
            ,percent_span : element(by.id('sp_app/service/suggest/select_product_confirm_dlg/summary/is_taxable/percent_span'))
        }
    }
}

module.exports = new Select_product_confirm_dlg();
