var mod = angular.module('model.group');
mod.factory('model.group.edit',
[
    '$http',
    '$q',
    'model.group.prompt',
    'model.group.rest',
function(
    $http,
    $q,
    group_prompt,
    rest_service
){
    return function(original_group){
        var defer = $q.defer();

        rest_service.get_item(original_group.id)
        .then(
            function(group){ 
                return group_prompt(group); 
            }
            ,function(reason){
                defer.reject(reason); 
            }
        )
        .then(
            function(prompt_data){
                rest_service.edit_item(prompt_data,original_group.id)
                .then(
                    function(group){
                        defer.resolve(group);
                    }
                    ,function(reason){
                        defer.reject(reason);
                    }
                )
            },
            function(reason){
                defer.reject(reason);
            }
        );

        return defer.promise;
    }
}]);
