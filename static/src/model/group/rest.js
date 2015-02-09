var mod = angular.module('model.group');
mod.factory('model.group.rest',
[
    '$http',
    '$q',
    'model.group.Group',
function(
    $http,
    $q,
    Group
){
    function get_item(group_id){
        var defer = $q.defer();

        $http({
            url:'/group/get_item',
            method:'GET',
            params:{group_id:group_id}
        }).then(
            function(data){
                defer.resolve(Group.build(data.data));
            },function(reason){
                defer.reject(reason);
            }
        )
        return defer.promise;
    }
    function edit_item(prompt_data,group_id){
        var defer = $q.defer();
        $http({
            url:'/group/update_angular',
            method:'POST',
            data:{group:JSON.stringify(prompt_data),id:group_id}
        })
        .then(
            function(data){
                defer.resolve(Group.build(data.data));
            }
            ,function(reason){ 
                defer.reject(reason);
            }
        )
        return defer.promise;
    }
    function get_lst(){
        /*
            data return is a group but not containing breakdown product for speed reason
        */
        var defer = $q.defer();
        $http({
            url:'/group/get_lst',
            method:'GET',
        }).then(
            function(data){
                defer.resolve(data.data.map(Group.build));
            },function(reason){
                defer.reject(reason);
            }
        )
        return defer.promise;
    }
    function create_item(group_prompt_result){
        var defer = $q.defer();
        $http({
            url:'/group/insert_angular',
            method:'POST',
            data:{group:JSON.stringify(group_prompt_result)}
        }).then(
            function(data){
                defer.resolve(Group.build(data.data));
            },
            function(reason){
                return $q.reject(reason);
            }
        );
        return defer.promise;
    }
    function delete_item(group_id){
        var defer = $q.defer();
        get_item(group_id).then(
            function(group){
                if(group.sp_lst.length === 0){
                    $http({
                        url:'/group/delete_angular',
                        method:'POST',
                        data:{group_id:group_id}
                    }).then(
                        function(){
                            defer.resolve();
                        },
                        function(reason){
                            defer.reject(reason);
                        }
                    );
                }else{
                    defer.reject('group must be empty to be deleted');
                }
            }
            ,function(reason){
                defer.reject(reason);
            }
        )
        return defer.promise;
    }        
    function execute_item(group_id,option){
        var defer = $q.defer();

        $http({
             method:'POST'
            ,url:'/group/execute'
            ,data:{group_id:group_id,option:JSON.stringify(option)}
        }).then(
            function(group_response_data){
                defer.resolve(Group.build(group_response_data.data));
            }
            ,function(reason){
                defer.reject(reason);
            }
        )       
        return defer.promise; 
    }

    return{
        delete_item:delete_item,
        create_item:create_item,
        get_lst:get_lst,
        get_item:get_item,
        edit_item:edit_item,
        execute_item:execute_item
    }
}])





