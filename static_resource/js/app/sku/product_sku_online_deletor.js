define(
[
    'lib/ui/ui'
]
,function
(
    ui
)
{
    return function (
         product_id 
        ,sku_str
        ,callback
    ){
        ui.ui_block('deleting sku from product ...')
        $.ajax({
             url : '/product/sku/delete'
            ,type : "POST"
            ,dataType : "json"
            ,data : {
                 product_id:product_id
                ,sku_str:sku_str
            }
            ,success: function(data,status_str,xhr){
                ui.ui_unblock();
                var product = data;
            	callback(null,product);
            }
            ,error: function(xhr,status_str,err){
                ui.ui_unblock();
                callback(xhr);
            }
        }); 
    }	
});