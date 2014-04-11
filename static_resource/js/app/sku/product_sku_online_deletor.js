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
             url : '/product/sku/delete'
            ,type : "POST"
            ,dataType : "json"
            ,data : {
                 product_id:product_id
                ,sku_str:sku_str
            }
            ,success: function(data){
                var product = data;
            	callback(null,product);
            }
            ,error: function(xhr,errmsg,err){
                callback('there is error');
            }
        }); 
    }	
});