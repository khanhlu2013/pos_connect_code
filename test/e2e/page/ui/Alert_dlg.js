var Alert_dlg = function () {

    this.self = element(by.id('service/ui/alert/dialog'));

    //btn
    this.ok_btn = element(by.id('service/ui/alert/ok_btn'));

    //function btn
    this.ok = function(){ this.ok_btn.click(); }
}

module.exports = new Alert_dlg();