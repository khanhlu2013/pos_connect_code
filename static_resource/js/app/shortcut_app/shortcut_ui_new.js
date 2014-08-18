define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('shortcut_app/shortcut_ui_new',[]);
    mod.factory('shortcut_app/shortcut_ui_new',[function(){
        
        function Shortcut_ui($scope,shortcut_lst){
            this.$scope = $scope;
            var this_scope = $scope;

            //init data
            this_scope.shortcut_lst             = shortcut_lst;
            this_scope.row_count                = ROW_COUNT;
            this_scope.column_count             = COL_COUNT;                
            this_scope.current_parent_pos       = 0;
            this_scope.col_lst                  = [];for(var i = 0;i<this_scope.column_count;i++){ this_scope.col_lst.push(i);}
            this_scope.row_lst                  = [];for(var i = 0;i<this_scope.row_count;i++)   { this_scope.row_lst.push(i);}

            //init method use in html template
            this_scope.set_cur_parent_position = function(pos){
                this_scope.current_parent_pos = pos;
            }
            this_scope.get_parent_caption = function(is_left,row){                  
                var caption = null;
                var position = row;
                if(!is_left){ position += this_scope.row_count; }
                var parent = get_parent(position);
                if(parent !=null){ caption = parent.caption;}
                return caption;
            }
            this_scope.get_child_caption_of_cur_parent = function(row,col){                  
                var caption = null;
                var child = get_child_of_cur_parent(row,col);
                if(child != null){ caption = child.caption; }
                return caption;
            }    

            Shortcut_ui.prototype={
                 constructor : Shortcut_ui
                ,set_cur_parent_position : function(pos){
                    this_scope.current_parent_pos = pos;
                }
                ,calculate_child_position : function(row,col){
                    return row * $scope.column_count + col;
                }
                ,get_parent : function(pos){
                    var parent = null;
                    for(var i = 0;i<$scope.shortcut_lst.length;i++){
                        if($scope.shortcut_lst[i].position == pos){
                            parent = $scope.shortcut_lst[i];
                            break;
                        }
                    }
                    return parent;                    
                }
                ,get_cur_parent : function(){
                    return get_parent(this_scope.current_parent_pos);
                }
                ,get_cur_parent_position : function(){
                    return this_scope.current_parent_pos;
                }
                ,get_child_of_cur_parent : function(row,col){
                    var child = null;
                    var parent = get_parent($scope.current_parent_pos);
                    if(parent != null){
                        var position = calculate_child_position(row,col);
                        for(var i = 0;i<parent.child_set.length;i++){
                            if(parent.child_set[i].position == position){
                                child = parent.child_set[i];
                                break;
                            }
                        }                        
                    }
                    return child;
                }
                ,add_shortcut : function(shortcut){
                    this_scope.shortcut_lst.push(shortcut)
                }
            }
        }

        return Shortcut_ui;
    }]);
})