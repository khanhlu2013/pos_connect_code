define(
    [
         'constance'
        ,'lib/number/number'
    ]
    ,function
    (
         constance
        ,number
    )
{
    function Store_product
    (
         _id
        ,_rev
        ,key
        ,store_id
        ,product_id
        ,name
        ,price
        ,value_customer_price
        ,crv
        ,is_taxable
        ,is_sale_report
        ,p_type
        ,p_tag
        ,sku_lst
        ,cost
        ,vendor
        ,buydown
        ,breakdown_assoc_lst
    )   
    {
        if(_id != null && _rev != null){
            //this is the case when we create new object to insert into pouch. These properties will handle by pouch.
            this._id = _id;
            this._rev = _rev;
        }

        this.key = key;
        this.store_id = store_id;
        this.product_id = product_id;
        this.name = name;
        this.price = (price == null ? null : Number(price));
        this.value_customer_price = (value_customer_price == null ? null : Number(value_customer_price));
        this.crv = (crv == null ? null : Number(crv));
        this.is_taxable = is_taxable;
        this.is_sale_report = is_sale_report;
        this.p_type = p_type;
        this.p_tag = p_tag;
        this.sku_lst = sku_lst;
        this.d_type = constance.STORE_PRODUCT_TYPE;
        this.cost = (cost == null ? null : Number(cost));
        this.vendor = vendor
        this.buydown = (buydown == null ? null : Number(buydown));
        this.breakdown_assoc_lst = breakdown_assoc_lst;
    };


    Store_product.prototype = {
         constructor: Store_product
        ,get_buydown: function(){
            if(this.breakdown_assoc_lst == undefined || this.breakdown_assoc_lst.length == 0){
                return this.buydown;
            }

            var result = 0.0;
            for(var i = 0;i<this.breakdown_assoc_lst.length;i++){
                var assoc = this.breakdown_assoc_lst[i];
                result += (assoc.breakdown.get_buydown() * assoc.qty);
            }
            return number.round_2_decimal(result);
        }        
        ,get_crv: function(){
            if(this.breakdown_assoc_lst == undefined || this.breakdown_assoc_lst.length == 0){
                return this.crv;
            }

            var result = 0.0;
            for(var i = 0;i<this.breakdown_assoc_lst.length;i++){
                var assoc = this.breakdown_assoc_lst[i];
                result += (assoc.breakdown.get_crv() * assoc.qty);
            }
            return number.round_2_decimal(result);
        }
    };

    return Store_product;
});