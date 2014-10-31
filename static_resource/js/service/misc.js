define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('service/misc',[]);
    mod.factory('service/misc',[function(){
        function get_item_from_lst_base_on_id(id,lst){
            var item = null;
            for(var i = 0;i<lst.length;i++){
                if(lst[i].id == id){
                    item = lst[i];
                    break;
                }
            }
            return item;
        }

        function get_item_from_lst_base_on_property(property,value,lst){
            var item = null;
            for(var i = 0;i<lst.length;i++){
                if(lst[i][property] == value){
                    item = lst[i];
                    break;
                }
            }
            return item;
        }

        function round_float_2_decimal(num){
            return parseFloat(num.toFixed(2));
        }

        return{
             get_item_from_lst_base_on_id : get_item_from_lst_base_on_id
            ,get_item_from_lst_base_on_property : get_item_from_lst_base_on_property
            ,round_float_2_decimal:round_float_2_decimal
        }
    }])
})