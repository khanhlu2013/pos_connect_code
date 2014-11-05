var base_path = './../../';
var lib = require(base_path + 'lib');

var Setup_dlg = function () {
    var COL = 3
    var ROW = 5
    var PARENT_LEFT = 0;
    var PARENT_RIGHT = 6;
    var PARENT_EDIT_LEFT = 1;
    var PARENT_EDIT_RIGHT = 5;

    //btn
    this.exit_btn = element(by.id('shortcut_app/service/manage/exit_btn'));

    //table
    this.lst = element.all(by.repeater('row_setup in row_lst'));

    //function btn
    this.exit = function(){lib.click(this.exit_btn);}

    //function child
    this._get_child_td = function(position){
        var row_coordinate = Math.floor(position/COL);
        var col_coordinate = (position % COL) + 2;  
        return this.lst.get(row_coordinate).all(by.tagName('td')).get(col_coordinate);
    }
    this.click_child = function(position){
        lib.click(this._get_child_td(position));
    }
    this.get_child_text = function(position){
        return this._get_child_td(position).getText();
    }

    //function parent
    this._get_parent_td = function(position){
        var row_coordinate = position;
        var col_coordinate = PARENT_LEFT;
        if(position > ROW -1){
            row_coordinate = position - ROW;
            col_coordinate = PARENT_RIGHT;
        }        
        return this.lst.get(row_coordinate).all(by.tagName('td')).get(col_coordinate);
    }
    this._get_parent_edit_td = function(position){
        var row_coordinate = position;
        var col_coordinate = PARENT_EDIT_LEFT;
        if(position > ROW -1){
            row_coordinate = position - ROW;
            col_coordinate = PARENT_EDIT_RIGHT;
        }        
        return this.lst.get(row_coordinate).all(by.tagName('td')).get(col_coordinate);        
    }
    this.get_parent_text = function(position){
        return this._get_parent_td(position).getText();
    }
    this.click_parent = function(position){
        lib.click(this._get_parent_td(position));
    }
    this.click_parent_edit = function(position){
        lib.click(this._get_parent_edit_td(position));
    }    

}   

module.exports = new Setup_dlg();
