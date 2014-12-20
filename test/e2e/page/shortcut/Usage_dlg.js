var base_path = './../../';
var lib = require(base_path + 'lib');

var Shortcut_usage_page = function () {
    //function shortcut
    var COL = 3
    var ROW = 5
    var PARENT_LEFT = 0;
    var PARENT_RIGHT = 4;
    this.shortcut_lst = element.all(by.repeater("row_usage in row_lst"));
    
    //function shortcut parent
    this._get_parent_td = function(position){
        var row_coordinate = position;
        var col_coordinate = PARENT_LEFT;
        if(position > ROW -1){
            row_coordinate = position - ROW;
            col_coordinate = PARENT_RIGHT;
        }        
        return this.shortcut_lst.get(row_coordinate).all(by.tagName('td')).get(col_coordinate);
    }
    this.get_parent_text = function(position){
        return this._get_parent_td(position).getText();
    }
    this.click_parent = function(position){
        lib.click(this._get_parent_td(position));
    }

    //function shortcut child
    this._get_child_td = function(position){
        var row_coordinate = Math.floor(position/COL);
        var col_coordinate = (position % COL) + 1;  
        return this.shortcut_lst.get(row_coordinate).all(by.tagName('td')).get(col_coordinate);
    }
    this.click_child = function(position){
        lib.click(this._get_child_td(position));
    }
    this.get_child_text = function(position){
        return this._get_child_td(position).getText();
    }    
}

module.exports = new Shortcut_usage_page();