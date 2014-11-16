/*
    . javascript_2_pouch service
        . a service to convert receipt model from javascript obj into pouch/couch document.
        . DE_PROMOTE: this is a low-level service as you can see it is storage adapter and need to depromote
*/

define(
[
     'angular'
    //--------
    ,'app/receipt_app/model'
    ,'app/sp_app/model'    
    ,'service/misc'
]
,function
(
    angular
)
{
    var mod = angular.module('receipt_app/service/receipt_storage_adapter',
    [
         'receipt_app/model'
        ,'sp_app/model'
        ,'service/misc'
    ]);
    mod.factory('receipt_app/service/receipt_storage_adapter',
    [
         '$rootScope'
        ,'receipt_app/model/Receipt'
        ,'receipt_app/model/Receipt_ln'
        ,'receipt_app/model/Tender_ln'
        ,'receipt_app/model/Mix_match_deal_info_stamp'
        ,'receipt_app/model/Store_product_stamp'        
        ,'sp_app/model/Non_inventory'
        ,'service/misc'
    ,function(
         $rootScope
        ,Receipt
        ,Receipt_ln
        ,Tender_ln
        ,Mix_match_deal_info_stamp
        ,Store_product_stamp
        ,Non_inventory
        ,misc_service
    ){
        function _java_2_pouch__receipt_ln(receipt_ln){
            /*  
                desc        : a helper to help converting 
                depromote   : true 
            */
            return receipt_ln;
        }
        function _pouch_2_java__mm_deal_info_stamp(doc){
            var mm_deal_info_stamp = null;
            if(doc!==null){
                mm_deal_info_stamp = new Mix_match_deal_info_stamp(
                     doc.name
                    ,doc.unit_discount
                );
            }
            return mm_deal_info_stamp;
        }
        function _pouch_2_java__non_inventory(doc){
            var non_inventory = null;
            if(doc!==null){
                non_inventory = new Non_inventory(
                     doc.name
                    ,doc.price
                    ,doc.is_taxable
                    ,doc.crv
                    ,doc.cost                            
                );                
            }
            return non_inventory;
        }
        function _pouch_2_java__store_product_stamp(doc){
            var store_product_stamp = null;
            if(doc!==null){
                store_product_stamp = new Store_product_stamp(
                     doc.sp_id
                    ,doc.doc_id
                    ,doc.offline_create_sku
                    ,doc.name
                    ,doc.price
                    ,doc.value_customer_price
                    ,doc.crv
                    ,doc.is_taxable
                    ,doc.is_sale_report
                    ,doc.p_type
                    ,doc.p_tag
                    ,doc.cost
                    ,doc.vendor
                    ,doc.buydown                    
                );
            }
            return store_product_stamp;
        }
        function _pouch_2_java__receipt_ln(doc){
            var receipt_ln = new Receipt_ln(
                 doc.id
                ,doc.qty
                ,doc.discount
                ,doc.override_price
                ,null//store_product
                ,_pouch_2_java__store_product_stamp(doc.store_product_stamp)
                ,_pouch_2_java__mm_deal_info_stamp(doc.mm_deal_info_stamp)
                ,_pouch_2_java__non_inventory(doc.non_inventory)
                ,new Date(doc.date)
            );
            return receipt_ln;
        }

        function _pouch_2_java__tender_ln(doc){
            var pt = null;
            if(doc.pt !== null){ pt = misc_service.get_item_from_lst_base_on_id(doc.pt.id,$rootScope.GLOBAL_SETTING.payment_type_lst); }
            
            var tender_ln = new Tender_ln(
                doc.id,
                pt,
                doc.amount,
                doc.name
            );
            return tender_ln;
        }

        function pouch_2_javascript(doc){
            var receipt = new Receipt
            (
                 doc.id 
                ,new Date(doc.date)
                ,doc.tax_rate
                ,doc.tender_ln_lst.map(_pouch_2_java__tender_ln)
                ,doc.receipt_ln_lst.map(_pouch_2_java__receipt_ln)
                ,doc._id
                ,doc._rev
            );
            return receipt;
        }
        function javascript_2_pouch(receipt){
            /*
                desc    : see comment on top of this file
                param   : receipt: receipt_app/model/Receipt obj
                return  : a document corresponding to this receipt
            */
            var doc = {
                 id             : receipt.id
                ,date           : receipt.date.toString()
                ,tax_rate       : receipt.tax_rate
                ,tender_ln_lst  : receipt.tender_ln_lst
                ,receipt_ln_lst : receipt.receipt_ln_lst.map(_java_2_pouch__receipt_ln)
                ,d_type         : $rootScope.GLOBAL_SETTING.receipt_document_type
            }
            return doc;
        }

        return {
             javascript_2_pouch:javascript_2_pouch
            ,pouch_2_javascript:pouch_2_javascript
        };
    }])
})