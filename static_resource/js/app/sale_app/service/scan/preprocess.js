define(
[
     'angular'
    //-------
    ,'app/sp_ll_app/service/api/offline/sku'
    ,'app/sp_app/service/select_sp_dlg'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/scan/preprocess',
    [
         'sp_ll_app/service/api/offline/sku'
        ,'sp_app/service/select_sp_dlg'
    ]);
    mod.factory('sale_app/service/scan/preprocess',
    [
         '$q'
        ,'sp_ll_app/service/api/offline/sku'
        ,'sp_app/service/select_sp_dlg'
    ,function(
         $q
        ,sku_search
        ,select_sp
    ){
        var SKU_NOT_FOUND = 'sku not found';

        function extract_qty_sku(scan_str){
            //init
            var defer = $q.defer();
            scan_str = scan_str.trim();
            var lst = scan_str.split(' ');
            var qty = null;var sku = null;  

            if(scan_str.length == 0){ return $q.reject('_cancel_'); }// reject empty scan
            if(lst.length >= 3){ return $q.reject('invalid scan'); }//reject 3 token scan
            if(lst.length == 2){
                var temp_qty = parseInt(lst[0]);
                if(isNaN(temp_qty)){ return $q.reject(lst[0] + ' is not a valid qty'); }
                else if(temp_qty<0){ return $q.reject('qty must be a positive number'); }
                else{ defer.resolve({qty:temp_qty,sku:lst[1]});return defer.promise; }
            }else{ defer.resolve({qty:1,sku:lst[0]});return defer.promise; }
        }

        function exe(scan_str){
            //init
            var defer = $q.defer();
            extract_qty_sku(scan_str).then(
                function(sku_qty){
                    var sku = sku_qty.sku;var qty = sku_qty.qty;

                    sku_search(sku).then(
                        function(sp_lst){
                            if(sp_lst.length > 1){
                                select_sp(sp_lst).then(
                                     function(sp){ defer.resolve({qty:qty,sp:sp}); }
                                    ,function(reason){defer.reject(reason);}
                                )
                            }
                            else if(sp_lst.length == 1){ defer.resolve({qty:qty,sp:sp_lst[0]}); }
                            else{ defer.reject(SKU_NOT_FOUND); }
                        }
                        ,function(reason){defer.reject(reason)}
                    );
                }
                ,function(reason){defer.reject(reason)}
            )
            return defer.promise;
        }

        return{
            exe:exe,
            extract_qty_sku : extract_qty_sku,
            SKU_NOT_FOUND : SKU_NOT_FOUND
        }
    }])
})