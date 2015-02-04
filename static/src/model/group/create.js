var mod = angular.module('model.group');
mod.factory('model.group.create',
[
    '$q',
    'model.group.prompt',
    'model.group.rest',
function(
    $q,
    prompt_service,
    rest    
){
    return function(){
        var defer = $q.defer();

        prompt_service(null).then(
             function(group_prompt_result){ 
                rest.create(group_prompt_result).then(
                    function(created_group){
                        defer.resolve(created_group);
                    },function(reason){
                        defer.reject(reason);
                    }
                )
            }
            ,function(reason){
                defer.reject(reason);
            }
        );
        
        return defer.promise;
    }
}]);