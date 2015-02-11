var mod = angular.module('model.group');

mod.factory('model.group.execute',
[
    '$modal',
    '$templateCache',
    'model.group.rest',
function(
    $modal,
    $templateCache,
    group_rest
){
    return function(group_id){
        
        var result = $modal.open({
             template:$templateCache.get('model.group.execute.main.html')
            ,controller:'model.group.execute.controller'
            ,size:'lg'
            ,resolve:{
                group : function(){
                    return group_rest.get_item(group_id);
                }
            }
        });
        return result;
    }
}]);
