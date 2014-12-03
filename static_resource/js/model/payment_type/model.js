define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('payment_type/model',[]);
    mod.factory('payment_type/model/Payment_type',function(){
        function Payment_type(id,name,sort,active){
            this.id = id;
            this.name = name;
            this.sort = sort;
            this.active = active
        }

        Payment_type.build = function(data){
            return new Payment_type(data.id,data.name,data.sort,data.active);
        }
        return Payment_type;
    })
})