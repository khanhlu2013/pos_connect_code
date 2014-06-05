define(function(){

    return function Pending_scan(key,qty,price,discount,sp_doc_id,non_product_name){
        this.key = key;
        this.qty = qty;
        this.price = price;
        this.discount = discount;
        this.sp_doc_id = sp_doc_id;
        this.non_product_name = non_product_name;
    };
});