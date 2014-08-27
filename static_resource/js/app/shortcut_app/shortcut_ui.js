define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('shortcut_app/shortcut_ui',[]);
    mod.factory('shortcut_app/shortcut_ui',['$rootScope',function($rootScope){
        function init($scope){

            $scope.shortcut_lst = $rootScope.GLOBAL_SETTING.shortcut_lst;          
            $scope.row_count = $rootScope.GLOBAL_SETTING.shortcut_row_count;
            $scope.column_count = $rootScope.GLOBAL_SETTING.shortcut_column_count;              
            $scope.current_parent_pos = 0;
            $scope.col_lst = [];for(var i = 0;i<$scope.column_count;i++){ $scope.col_lst.push(i);}
            $scope.row_lst = [];for(var i = 0;i<$scope.row_count;i++){ $scope.row_lst.push(i);}

            $scope.set_cur_parent_position = function(pos){
                $scope.current_parent_pos = pos;
            }
            $scope.get_parent_caption = function(is_left,row){                  
                var caption = null;
                var position = row;
                if(!is_left){
                    position += $scope.row_count;
                }
                var parent = get_parent(position,$scope);
                if(parent !=null){
                    caption = parent.caption;
                }
                return caption;
            }
            $scope.get_child_caption_of_cur_parent = function(row,col){                  
                var caption = null;
                var child = get_child_of_cur_parent(row,col,$scope);
                if(child != null){
                    caption = child.caption;
                }
                return caption;
            }                       
        }    
        
        function calculate_child_position(row,col,$scope){
            return row * $scope.column_count + col;
        }     
        function get_parent(pos,$scope){
            var parent = null;
            for(var i = 0;i<$scope.shortcut_lst.length;i++){
                if($scope.shortcut_lst[i].position == pos){
                    parent = $scope.shortcut_lst[i];
                    break;
                }
            }
            return parent;
        }     
        function get_cur_parent($scope){
            return get_parent($scope.current_parent_pos,$scope);
        }    
        function get_cur_parent_position($scope){
            return $scope.current_parent_pos;
        }                
        function get_child_of_cur_parent(row,col,$scope){
            var child = null;
            var parent = get_parent($scope.current_parent_pos,$scope);
            if(parent != null){
                var position = calculate_child_position(row,col,$scope);
                for(var i = 0;i<parent.child_set.length;i++){
                    if(parent.child_set[i].position == position){
                        child = parent.child_set[i];
                        break;
                    }
                }                        
            }
            return child;
        }


        return {
            init                        : init,
            get_cur_parent              : get_cur_parent,
            calculate_child_position    : calculate_child_position,                
            get_child_of_cur_parent     : get_child_of_cur_parent,
            get_parent                  : get_parent,
            get_cur_parent_position     : get_cur_parent_position,
        };
    }]);
})