define(
[
    'lib/ui/ui'
]
,function
(
    ui
)
{
    function exe(product_id,callback){
        ui.ui_block("get group info ...")
        $.ajax({
             url : '/product/group/get'
            ,type : 'GET'
            ,dataType : 'json'
            ,data : {
                 'product_id':product_id
            }
            ,success : function(data,status_str,xhr){
                ui.ui_unblock();
                callback(null/*error*/,data/*group_lst*/);
            }
            ,error : function(xhr,status_str,err){
                ui.ui_unblock();
                callback(xhr);
            }
        });
    }

    return{
        exe:exe
    }
});