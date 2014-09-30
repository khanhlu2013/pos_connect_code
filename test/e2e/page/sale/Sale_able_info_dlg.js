var Sale_able_info_dlg = function () {

    this.self = element(by.id('sale_app/service/sale_able_info_dlg'));

    //lbl
    this.preset_price_lbl = element(by.id('sale_app/service/sale_able_info_dlg/preset_price'));
    this.override_price_lbl = element(by.id('sale_app/service/sale_able_info_dlg/override_price')); 
    this.mm_deal_title_lbl = element(by.id('sale_app/service/sale_able_info_dlg/mm_deal_name'));
    this.mm_deal_lbl = element(by.id('sale_app/service/sale_able_info_dlg/mm_deal_unit_discount'));
    this.buydown_lbl = element(by.id('sale_app/service/sale_able_info_dlg/buydown'));
    this.advertise_price_lbl = element(by.id('sale_app/service/sale_able_info_dlg/advertise_price'));
    this.crv_lbl = element(by.id('sale_app/service/sale_able_info_dlg/crv'));
    this.buydown_tax_lbl = element(by.id('sale_app/service/sale_able_info_dlg/buydown_tax'));
    this.tax_lbl = element(by.id('sale_app/service/sale_able_info_dlg/tax'));
    this.otd_price_lbl = element(by.id('sale_app/service/sale_able_info_dlg/otd_price'));

    //btn
    this.ok_btn = element(by.id('sale_app/service/sale_able_info_dlg/ok_btn'));
    this.cancel_btn = element(by.id('sale_app/service/sale_able_info_dlg/cancel_btn'));
    this.override_price_btn = element(by.id('sale_app/service/sale_able_info_dlg/override_price_btn'));
    this.remove_override_price_btn = element(by.id('sale_app/service/sale_able_info_dlg/remove_override_price_btn'));

    //btn function
    this.ok = function(){ this.ok_btn.click(); }
    this.cancel = function() { this.cancel_btn.click(); }
    this.override_price = function() { this.override_price_btn.click(); }
    this.remove_override_price = function() { this.remove_override_price_btn.click(); }
}   

module.exports = new Sale_able_info_dlg();