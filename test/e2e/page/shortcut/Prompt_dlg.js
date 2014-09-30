var base_path = './../../';
var lib = require(base_path + 'lib');

var Prompt_dlg = function () {
    //txt
    this.caption_txt = element(by.id('shortcut_app/service/prompt/caption_txt'));
    this.sp_txt = element(by.id('shortcut_app/service/prompt/sp_txt'));

    //btn
    this.prompt_sp_btn = element(by.id('shortcut_app/service/prompt/sp_btn'));
    this.ok_btn = element(by.id('shortcut_app/service/prompt/ok_btn'));
    this.cancel_btn = element(by.id('shortcut_app/service/prompt/cancel_btn'));

    //function txt
    this.set_caption = function(caption){ this.caption_txt.clear(); this.caption_txt.sendKeys(caption); }
    this.get_caption = function(){ return this.caption_txt.getAttribute('value'); }
    this.get_sp = function(){ return this.sp_txt.getAttribute('value'); }

    //function btn
    this.prompt_sp = function(){ lib.click(this.prompt_sp_btn);}
    this.ok = function(){ lib.click(this.ok_btn); }
    this.cancel = function(){ lib.click(this.cancel_btn); }
}   

module.exports = new Prompt_dlg();