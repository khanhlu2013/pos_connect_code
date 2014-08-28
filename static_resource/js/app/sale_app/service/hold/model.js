define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/hold/model',[]);
    mod.factory('sale_app/service/hold/model/Hold',[function(){
        function Hold(timestamp,ds_lst){
            this.timestamp = timestamp;
            this.ds_lst = ds_lst;
        }

        Hold.prototype = {
             constructor : Hold
            ,get_total : function(tax_rate){
                var result = 0.0;
                for(var i = 0;i<this.ds_lst.length;i++){
                    result += this.ds_lst[i].get_line_total(tax_rate);
                }
                return result;
            }
        }
        return Hold;
    }])
})