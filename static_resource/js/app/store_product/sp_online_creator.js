define(
[
]
,function
(

)
{
    return function (
         product_id
        ,name
        ,price
        ,crv
        ,is_taxable
        ,is_sale_report
        ,sku_str
        ,p_type
        ,p_tag
        ,callback
    )
    {

        var data = {
             product_id : product_id
            ,name : name
            ,price : price
            ,crv : crv
            ,is_taxable : is_taxable
            ,is_sale_report : is_sale_report
            ,sku_str : sku_str
            ,p_type : p_type
            ,p_tag : p_tag
        }

        $.ajax({
             url:'/product/sp_creator'
            ,method: "POST" 
            ,data : data
            ,dataType:'json'
            ,success:function(data,status_str,xhr){
                callback(null/*error*/,data);
            }
            ,error:function(xhr,status_str,err){
                callback(xhr);
            }
        });
    }
});