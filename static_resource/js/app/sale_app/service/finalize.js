define(
[
     'angular'
    //--------
    ,'service/db'  
    ,'model/receipt/model'  
    ,'model/receipt/service/receipt_storage_adapter'
    ,'app/sale_app/service/tender_ui'
]
,function
(
     angular
)
{
    var mod = angular.module('sale_app/service/finalize',
    [
         'receipt/model'
        ,'service/db'
        ,'receipt/service/receipt_storage_adapter'
        ,'sale_app/service/tender_ui'
    ]);
    mod.factory('sale_app/service/finalize',
    [
         '$q'
        ,'$rootScope'
        ,'receipt/model/Receipt'
        ,'receipt/model/Receipt_ln'        
        ,'receipt/model/Store_product_stamp'    
        ,'receipt/model/Mix_match_deal_info_stamp'               
        ,'service/db/get'
        ,'receipt/service/receipt_storage_adapter'
        ,'sale_app/service/tender_ui'
    ,function(
         $q
        ,$rootScope
        ,Receipt
        ,Receipt_ln
        ,Store_product_stamp
        ,Mix_match_deal_info_stamp
        ,get_pouch_db
        ,receipt_storage_adapter
        ,tender_ui_service
    ){
        function _create_mm_deal_info_stamp(mm_deal_info){
            return new Mix_match_deal_info_stamp(mm_deal_info.mm_deal.name,mm_deal_info.get_unit_discount());
        }
        function _create_store_product_stamp(sp){
            return new Store_product_stamp(
                 sp.id//sp_id
                ,sp.sp_doc_id
                ,sp.get_offline_create_sku()
                ,sp.name
                ,sp.price
                ,sp.value_customer_price
                ,sp.get_crv()
                ,sp.is_taxable
                ,sp.is_sale_report
                ,sp.p_type
                ,sp.p_tag
                ,sp.get_cost()
                ,sp.vendor
                ,sp.get_buydown()
            )
        }
        function _create_receipt_ln_lst(ds_lst){
            var result = [];
            for(var i = 0;i<ds_lst.length;i++){
                var ds = ds_lst[i];
                var store_product_stamp = null;     if(!ds.is_non_inventory()){ store_product_stamp = _create_store_product_stamp(ds.store_product)}
                var mm_deal_info_stamp = null;      if(ds.mm_deal_info!==null){mm_deal_info_stamp = _create_mm_deal_info_stamp(ds.mm_deal_info)}
                var receipt_ln = new Receipt_ln(
                     null//id - because it is not yet posted online
                    ,ds.qty
                    ,ds.discount
                    ,ds.override_price
                    ,null//store_product
                    ,store_product_stamp
                    ,mm_deal_info_stamp
                    ,ds.non_inventory
                    ,ds.date
                );
                result.push(receipt_ln);
            }
            return result;
        }

        return function(ds_lst){
            var defer = $q.defer();
            if(ds_lst.length == 0){return $q.reject('ds_lst is empty')}

            tender_ui_service(ds_lst,null,$rootScope.GLOBAL_SETTING.tax_rate).then(
                function(tender_ln_lst){
                    var receipt_ln_lst = _create_receipt_ln_lst(ds_lst);
                    var receipt = new Receipt(
                         null// id. it is null because it is not yet saved online. 
                        ,new Date()
                        ,$rootScope.GLOBAL_SETTING.tax_rate
                        ,tender_ln_lst
                        ,receipt_ln_lst
                        ,null//doc_id . it is null because we don't know this doc_id until we saved into pouch
                        ,null//doc_rev. it is null because we don't know this doc_id until we saved into pouch
                    );

                    var pouch = get_pouch_db();
                    pouch.post(receipt_storage_adapter.javascript_2_pouch(receipt)).then(
                        function(response){ 
                            receipt.doc_id = response.id;
                            receipt.doc_rev = response.rev;
                            defer.resolve(receipt); 
                        }
                        ,function(reason){ 
                            defer.reject(reason); 
                        }
                    )          
                }
                ,function(reason){
                    defer.reject(reason);
                }
            );
            return defer.promise;
        }
    }])
})