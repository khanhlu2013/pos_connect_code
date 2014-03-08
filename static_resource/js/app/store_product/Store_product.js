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
        ,product_id
        ,name
        ,price
        ,crv
        ,is_taxable
        ,sku_lst
        ,create_offline
        ,create_offline_by_sku
    )   
    {
        if(_id != null && _rev != null){
            //this is the case when we create new object to insert into pouch. These properties will handle by pouch.
            this._id = _id;
            this._rev = _rev;
        }

        this.key = key;
        this.product_id = product_id;
        this.name = name;
        this.price = (price == null ? null : Number(price));
        this.crv = (crv == null ? null : Number(crv));
        this.is_taxable = is_taxable;
        this.sku_lst = sku_lst;
        this.d_type = constance.STORE_PRODUCT_TYPE;
        this.create_offline = create_offline;
        this.create_offline_by_sku = create_offline_by_sku;
    };

    return Store_product;
});