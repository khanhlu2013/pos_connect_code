define(
    [

    ]
    ,function
    (

    )
{

    var ERROR_SALE_SHORTCUT_PRODUCT_EMTPY = 'ERROR_SALE_SHORTCUT_PRODUCT_EMTPY';
    var ERROR_SALE_SHORTCUT_CAPTION_EMTPY = 'ERROR_SALE_SHORTCUT_CAPTION_EMTPY';


    function exe(product_id,caption){
        var error_lst = [];

        if(product_id == null){
            error_lst.push(ERROR_SALE_SHORTCUT_PRODUCT_EMTPY);
        }

        if(caption.length == 0){
            error_lst.push(ERROR_SALE_SHORTCUT_CAPTION_EMTPY);
        }
        return error_lst;
    }

    return{
         exe:exe
        ,ERROR_SALE_SHORTCUT_PRODUCT_EMTPY:ERROR_SALE_SHORTCUT_PRODUCT_EMTPY 
        ,ERROR_SALE_SHORTCUT_CAPTION_EMTPY:ERROR_SALE_SHORTCUT_CAPTION_EMTPY
    }
});