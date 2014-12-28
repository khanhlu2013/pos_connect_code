var base_path = './../../';
var lib = require(base_path + 'lib');

var Report_dlg = function () {
    
    //lst
    this.type_tag_report_lst = element.all(by.repeater('report_item in get_type_tag_report_data()'));
    this.pt_report_lst = element.all(by.repeater('report_item in payment_type_report_data'));

    //btn
    this.exit_btn = element(by.id('report/sale/exit_btn'));
    this.refresh_report_btn = element(by.id('report/sale/refresh_report'));
    this.refresh_today_report_btn = element(by.id('report/sale/refresh_today_report'));

    //txt input
    this.from_txt = element(by.id('report/sale/from_date_txt'));
    this.to_txt = element(by.id('report/sale/from_date_txt'));

    //function btn
    this.exit = function(){ 
        lib.click(this.exit_btn); 
    }
    this.refresh_today_report = function(){
        lib.click(this.refresh_today_report_btn);
    }
    this.refresh_report = function(){
        lib.click(this.refresh_report_btn);
        lib.wait_for_block_ui();
    }    
}

module.exports = new Report_dlg();