define(
[
     'angular'
    //-------
    ,'app/sale_app/service/search_sku'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/scan/preprocess',['sale_app/service/search_sku']);
    mod.factory('sale_app/service/scan/preprocess',['$q','sale_app/service/search_sku',function($q,sku_search){
        return function(scan_str){
            
            //init
            var defer = $q.defer();
            scan_str = scan_str.trim();

            //empty scan -> reject
            if(scan_str.length == 0){ defer.reject('_cancel_'); return defer.promise; }

            //3 token -> reject
            var lst = scan_str.split(' ');
            if(lst.length >= 3){ defer.reject('invalid scan');return defer.promise;}

            //2 or 1 token scan str, continue to validate
            var qty = null;var sku = null;  
            if(lst.length == 2){
                var temp_qty = parseInt(lst[0]);
                if(isNaN(temp_qty)){
                    defer.reject(lst[0] + ' is not a valid qty');
                }else if(temp_qty<0){
                    defer.reject('qty must be a positive number');
                }else{
                    qty = temp_qty;
                    sku = lst[1];
                }
            }else{
                qty = 1;
                sku = lst[0];
            }
            if(qty == null || sku == null){return defer.promise;}

            //validate success, lets search for sku
            sku_search(sku).then(
                function(sp_lst){
                    if(sp_lst.length > 1){
                        select_product(sp_lst).then(
                             function(sp){ defer.resolve({qty:qty,sp:sp_lst[0]}); }
                            ,function(reason){defer.reject(reason);}
                        )
                    }
                    else if(sp_lst.length == 1){ defer.resolve({qty:qty,sp:sp_lst[0]}); }
                    else{ defer.reject('sku not found'); }
                }
                ,function(reason){defer.reject(reason)}
            );

            return defer.promise;
        }
    }])
})