define(
[
     'angular'
    //-------
    ,'service/db'
    ,'app/sp_app/model'
    ,'app/product_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/search/sp_api',
    [
         'service/db'
        ,'sp_app/model'
        ,'product_app/model'
    ]);
    /* search pouchdb for sp and sp.breakdown_assoc_lst (recursively) */
    mod.factory('sale_app/service/search/sp_api',
    [
         '$q'
        ,'service/db/get'
        ,'sp_app/model/Store_product'
        ,'sp_app/model/Kit_breakdown_assoc'        
        ,'product_app/model/Product'   
        ,'product_app/model/Prod_sku_assoc'   
    ,function(
         $q
        ,get_db
        ,Store_product
        ,Kit_breakdown_assoc
        ,Product
        ,Prod_sku_assoc
    ){
        function get_sp_from_sp_lst_base_on_pid(pid,sp_lst){
            var ret = null;
            for(var i = 0;i<sp_lst.length;i++){
                if(sp_lst[i].product_id==pid){
                    ret = sp_lst[i];
                    break;
                }
            }
            return ret;
        }

        function create_sp(sp_couch,sp_lst_of_bd_assoc){
            var prod_sku_assoc_lst = [];
            for(var i = 0;i<sp_couch.sku_lst.length;i++){
                var temp = new Prod_sku_assoc(
                     sp_couch.product_id
                    ,null//creator id
                    ,[sp_couch.store_id,]//store_lst
                    ,sp_couch.sku_lst[i]//sku_str
                );
                prod_sku_assoc_lst.push(temp);
            }
            var product = new Product(
                 sp_couch.product_id
                ,null//name
                ,null//sp_lst
                ,prod_sku_assoc_lst
            );
            var breakdown_assoc_lst = [];
            for(var i = 0;i<sp_couch.breakdown_assoc_lst.length;i++){
                var assoc = sp_couch.breakdown_assoc_lst[i];
                var sp = get_sp_from_sp_lst_base_on_pid(assoc.product_id,sp_lst_of_bd_assoc);
                breakdown_assoc_lst.push(new Kit_breakdown_assoc(null/*id*/,sp/*breakdown*/,assoc.qty))
            }

            var sp = new Store_product(
                 sp_couch.id
                ,sp_couch.product_id
                ,sp_couch.store_id
                ,sp_couch.name
                ,sp_couch.price
                ,sp_couch.value_customer_price
                ,sp_couch.crv
                ,sp_couch.is_taxable
                ,sp_couch.is_sale_report
                ,sp_couch.p_type
                ,sp_couch.p_tag
                ,sp_couch.cost
                ,sp_couch.vendor
                ,sp_couch.buydown
                ,product
                ,null//group_lst
                ,breakdown_assoc_lst
                ,null//kit_assoc_lst                            
            );
            return sp;
        }

        function exe(product_id){
            var defer = $q.defer();

            var db = get_db();
            db.query('views/by_product_id',{key:product_id}).then(function(lst){
                if(lst.rows.length == 0){
                    defer.resolve(null);
                }else if(lst.rows.length > 1){
                    defer.reject('multiple product found for 1 product_id ' + product_id);
                }else{
                    var sp_couch = lst.rows[0].value;
                    if(sp_couch.breakdown_assoc_lst.length == 0){
                        defer.resolve(create_sp(sp_couch,[]/*breakdown assoc lst*/));
                    }else{
                        var promise_lst = [];
                        for(var i = 0;i<sp_couch.breakdown_assoc_lst.length;i++){
                            promise_lst.push(exe(sp_couch.breakdown_assoc_lst[i].product_id))
                        }
                        $q.all(promise_lst).then(function(data){
                            defer.resolve(create_sp(sp_couch,data));
                        })
                    }
                }
            });
            return defer.promise; 
        }

        return exe;
    }])
})