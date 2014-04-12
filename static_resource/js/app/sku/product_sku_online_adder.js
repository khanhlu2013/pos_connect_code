define(
[
]
,function
(
)
{
    return function (
         product_id 
        ,sku_str
        ,callback
    ){
        $.ajax({
             url : '/product/sku/add'
            ,type : "POST"
            ,dataType : "json"
            ,data : {
                 product_id:product_id
                ,sku_str:sku_str
            }
            ,success: function(data,status_str,xhr){
                var product = data;
            	callback(null,product);
            }
            ,error: function(xhr,status_str,err){
                callback(xhr);
            }
        }); 
    }	
});