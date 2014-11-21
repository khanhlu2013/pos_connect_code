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
        function get_unique_lst(lst) {
            return lst.reduce(function(p, c) {
                if (p.indexOf(c) < 0) p.push(c);
                return p;
            }, []);
        };
        // function get_mode(array)
        // {
        //     if(array.length == 0)
        //         return null;
            
        //     var modeMap = {};
        //     var maxEl = array[0], maxCount = 1;
        //     for(var i = 0; i < array.length; i++)
        //     {
        //         var el = array[i];
        //         if(modeMap[el] == null)
        //             modeMap[el] = 1;
        //         else
        //             modeMap[el]++;  
        //         if(modeMap[el] > maxCount)
        //         {
        //             maxEl = el;
        //             maxCount = modeMap[el];
        //         }
        //     }
        //     return maxEl;
        // }        
        return{
             get_item_from_lst_base_on_id : get_item_from_lst_base_on_id
            ,get_item_from_lst_base_on_property : get_item_from_lst_base_on_property
            ,round_float_2_decimal:round_float_2_decimal
            ,get_unique_lst:get_unique_lst
        }
    }])
})