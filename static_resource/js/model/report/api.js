define(
[
    'angular'
    //---
    ,'model/report/model'
]
,function
(
    angular
)
{
    var mod = angular.module('report/api',
    [
        'report/model'
    ]);

    mod.factory('report/api',
    [
         '$http'
        ,'$q'
        ,'report/model/Report'
    ,function(
         $http
        ,$q
        ,Report
    ){
        function get_item(report_id){
            var defer = $q.defer();

            $http({
                url:'/report/get_item',
                method:'GET',
                params:{report_id:report_id}
            }).then(
                function(data){
                    defer.resolve(Report.build(data.data));
                },function(reason){
                    defer.reject(reason);
                }
            )
            return defer.promise;
        }
        function edit_item(prompt_data,report_id){
            var defer = $q.defer();
            $http({
                url:'/report/update_angular',
                method:'POST',
                data:{report:JSON.stringify(prompt_data),id:report_id}
            })
            .then(
                function(data){
                    defer.resolve(data.data);
                }
                ,function(reason){ 
                    defer.reject(reason);
                }
            )
            return defer.promise;
        }
        function get_lst(){
            /*
                data return is a report but not containing breakdown product for speed reason
            */
            var defer = $q.defer();
            $http({
                url:'/report/get_lst',
                method:'GET',
            }).then(
                function(data){
                    defer.resolve(data.data.map(Report.build));
                },function(reason){
                    defer.reject(reason);
                }
            )
            return defer.promise;
        }
        function create(report_prompt_result){
            var defer = $q.defer();
            $http({
                url:'/report/insert_angular',
                method:'POST',
                data:{report:JSON.stringify(report_prompt_result)}
            }).then(
                function(data){
                    defer.resolve(Report.build(data.data));
                },
                function(reason){
                    return $q.reject(reason);
                }
            );
            return defer.promise;
        }
        function delete_item(report_id){
            var defer = $q.defer();
            get_item(report_id).then(
                function(report){
                    if(report.sp_lst.length === 0){
                        $http({
                            url:'/report/delete_angular',
                            method:'POST',
                            data:{report_id:report_id}
                        }).then(
                            function(){
                                defer.resolve();
                            },
                            function(reason){
                                defer.reject(reason);
                            }
                        );
                    }else{
                        defer.reject('report must be empty to be deleted');
                    }
                }
                ,function(reason){
                    defer.reject(reason);
                }
            )
            return defer.promise;
        }        

        return{
            delete_item:delete_item,
            create:create,
            get_lst:get_lst,
            get_item:get_item,
            edit_item:edit_item
        }
    }])
})