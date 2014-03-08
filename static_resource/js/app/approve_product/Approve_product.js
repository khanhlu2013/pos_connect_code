define(
    [
        'constance'
    ]
    ,function
    (
        constance
    )
{
    function Approve_product
    (
         _id
        ,_doc_id_rev
        ,product_id
        ,name
        ,sku_lst
    )   
    {
        if(_id != null && _doc_id_rev != null){
            //this is the case when we create new object to insert into pouch. These properties will handle by pouch.
            this._id = _id;
            this._doc_id_rev = _doc_id_rev;
        }

        this.product_id = product_id;
        this.name = name;
        this.sku_lst = sku_lst;
        this.d_type = constance.APPROVE_PRODUCT_TYPE;
    };

    return Approve_product;
});
