var Prompt_dlg = function () {

    //txt
    this.prompt_txt = element(by.id('service/ui/prompt/prompt_txt'));    

    //btn
    this.ok_btn = element(by.id('service/ui/prompt/ok_btn')); 
    this.cancel_btn = element(by.id('service/ui/prompt/cancel_btn')); 

    //function txt
    this.set_prompt = function(str){
        this.prompt_txt.clear();
        this.prompt_txt.sendKeys(str);
    }
    this.get_prompt = function(){ return this.prompt_txt.getAttribute('value');}

    //function btn
    this.ok = function(){ this.ok_btn.click(); }
    this.cancel = function(){ this.cancel_btn.click(); }
}

module.exports = new Prompt_dlg();