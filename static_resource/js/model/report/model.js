define(
[
    'angular'
    //----
    ,'model/sp/model'
]
,function
(
    angular
)
{
    var mod = angular.module('report/model',
    [
        'sp/model'
    ]);

    //GROUP MODEL
    mod.factory('report/model/Report',['$injector',function($injector){
        function Report(id,name,sp_lst){
            this.id = id;
            this.name = name;
            this.sp_lst = sp_lst;
        }
        Report.build = function(data){
            var sp_lst = null;
            var Store_product = $injector.get('sp/model/Store_product');
            if(data.sp_lst != undefined){
                sp_lst = data.sp_lst.map(Store_product.build)
            }
            return new Report(data.id,data.name,sp_lst);
        }
        return Report;
    }]);
})