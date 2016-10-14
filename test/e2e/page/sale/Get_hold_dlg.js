var base_path = './../../';
var lib = require(base_path + 'lib');

var Get_hold_dlg = function () {

    function get_hold_col_index(col_name){
        if(col_name === 'date'){ return 0; }
        else if(col_name === 'total'){ return 1; } 
        else if(col_name === 'select'){ return 2; }
    }

    function get_hold_ln_col_index(col_name){
        if(col_name === 'qty'){ return 0; }
        else if(col_name === 'product'){ return 1; } 
        else if(col_name === 'price'){ return 2; }
    }

    var hold_lst = element.all(by.repeater('hold in hold_lst | orderBy : \'-hold.timestamp\''));
    var hold_ln_lst = element.all(by.repeater('ds in cur_hold.ds_lst'));

    //btn
    this.ok_btn = element(by.id('sale_app/service/hold/get_hold_ui/ok_btn'));
    this.cancel_btn = element(by.id('sale_app/service/hold/get_hold_ui/cancel_btn'));

    //function btn
    this.ok = function(){lib.click(this.ok_btn);}
    this.cancel = function(){lib.click(this.cancel_btn);}

    this.hold = {
        lst : hold_lst
        ,click_col : function(index,col_name){
            var col_index = get_hold_col_index(col_name);
            lib.click(hold_lst.get(index).all(by.tagName('td')).get(col_index));
        }
    },
    this.hold_ln = {
        lst : hold_ln_lst
        ,get_col : function(index,col_name){
            var col_index = get_hold_ln_col_index(col_name);
            return hold_ln_lst.get(index).all(by.tagName('td')).get(col_index).getText();
        }
    }

}

module.exports = new Get_hold_dlg();
