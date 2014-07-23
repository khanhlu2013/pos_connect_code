define(
[
    'angular'
    //----
    ,'app/sp_app/service/convert'
]
,function
(
    angular
)
{
    var mod = angular.module('receipt_app/service/convert',['sp_app/service/convert']);

    mod.factory('receipt_app/service/convert/item',['sp_app/service/convert/item',function(convert_sp_item){
    	return function(receipt){
            receipt.time_stamp = new Date(receipt.time_stamp);
            receipt.tax_rate = parseFloat(receipt.tax_rate);

            //tender line lst
            for(var i=0;i<receipt.tender_ln_set.length;i++){
                tender_ln_set[i].amount = parseFloat(tender_ln_set[i].amount);
            }

            //receipt line lst
            for(var i = 0;i<receipt_ln_set.length;i++){
                var ln = receipt_ln_set[i];
                
                //store product info
                ln.store_product = convert_sp_item(ln.store_product);

                //stamp info
                ln.price = parseFloat(ln.price);
                ln.crv = parseFloat(ln.crv);
                ln.discount = parseFloat(ln.discount);
                ln.discount_mm_deal = parseFloat(ln.discount_mm_deal);
                ln.cost = parseFloat(ln.cost);
                ln.buydown = parseFloat(ln.buydown);
            }
            return receipt;
    	}
    }]);

    mod.factory('receipt_app/service/convert/lst',['receipt_app/service/convert/item',function(convert_receipt_item){
        return function(receipt_lst){
            for(var i = 0;i<receipt_lst.length;i++){
                convert_receipt_item(receipt_lst[i]);
            }
            return receipt_lst;
        }
    }])
})
