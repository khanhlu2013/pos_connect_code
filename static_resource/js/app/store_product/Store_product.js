define(
    [
        'constance'
    ]
    ,function
    (
        constance
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
        ,crv
        ,is_taxable
        ,is_sale_report
        ,p_type
        ,p_tag
        ,sku_lst
        ,cost
        ,vendor
        ,buydown
        ,kit_child_bare_lst
        ,kit_child_lst
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
        this.kit_child_bare_lst = kit_child_bare_lst;
        this.kit_child_lst = kit_child_lst;
    };

    return Store_product;
});