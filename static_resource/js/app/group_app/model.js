define(
[
    'angular'
    //----
    ,'app/sp_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('group_app/model',['sp_app/model']);
    mod.factory('group_app/model/Group',['sp_app/model/Store_product',function(Store_product){
        function Group(id,name,sp_lst){
            this.id = id;
            this.name = name;
            this.sp_lst = sp_lst;
        }
        Group.build = function(data){
            var sp_lst = null;
            if(data.store_product_set != undefined){
                sp_lst = data.store_product_set.map(Store_product.build)
            }
            return new Group(data.id,data.name,sp_lst);
        }
        return Group;
    }]);
})