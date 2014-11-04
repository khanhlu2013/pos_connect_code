define(
[
     'angular'
    //-------
    ,'app/sale_app/service/pending_scan/set_api'
    ,'app/sp_app/model'

]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/pending_scan/get_api',
    [
         'sale_app/service/pending_scan/set_api'
        ,'sp_app/model'
    ]);
    mod.factory('sale_app/service/pending_scan/get_api',
    [
         'sale_app/service/pending_scan/set_api'
        ,'sp_app/model/Non_inventory'
    ,function(
         set_ps_lst
        ,Non_inventory
    ){
        return function(){
            var str = localStorage.getItem('pending_scan_lst');
            if(str === null){
                var ps_lst = []
                set_ps_lst(ps_lst);
                return ps_lst;
            }else{
                var ps_lst = JSON.parse(str);
                //form ps.date obj and re-create Non_inventory model
                for(var i = 0;i<ps_lst.length;i++){
                    //stamp date
                    ps_lst[i].date = new Date(ps_lst[i].date);

                    //re-create non_inventory model from local storage so it can have their prototype
                    var non_inventory = ps_lst[i].non_inventory;
                    if(non_inventory!==null){
                        var obj = new Non_inventory(
                             non_inventory.name
                            ,non_inventory.price
                            ,non_inventory.is_taxable
                            ,non_inventory.crv
                            ,non_inventory.cost                            
                        );
                        ps_lst[i].non_inventory = obj;
                    } 
                }
                return ps_lst;
            }
        }
    }])
})