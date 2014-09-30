var base_path = './../../'
var lib = require(base_path + 'lib');

var Sp_info_dlg = function () {

    //tab 
    this.main_tab = element(by.id('sp_app/service/info/tab/sp'));  
    this.sku_tab = element(by.id('sp_app/service/info/tab/sku'));   
    this.kit_tab = element(by.id('sp_app/service/info/tab/kit'));  
    this.group_tab = element(by.id('sp_app/service/info/tab/group')); 

    //btn
    this.edit_btn = element(by.id('sp_app/service/info/edit_btn'));    
    this.exit_btn = element(by.id('sp_app/service/info/exit_btn'));

    //table
    this.group_lst = element.all(by.repeater('group_info in sp.group_lst'));

    //button function
    this.edit = function(){ lib.click(this.edit_btn); }
    this.exit = function(){ lib.click(this.exit_btn); }
    
    this.switch_tab = function(tab_name){
        if(tab_name === 'main')         { this.main_tab.click(); }
        else if(tab_name === 'group')   { this.group_tab.click(); }
        else if(tab_name === 'kit')     { this.kit_tab.click(); }
        else if(tab_name === 'sku')     { this.sku_tab.click(); }
    }

}

module.exports = new Sp_info_dlg();
