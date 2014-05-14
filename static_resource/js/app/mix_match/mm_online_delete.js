define(
[
     'lib/async'
    ,'lib/ui/ui'
]
,function
(
     async
    ,ui 
)
{
    function exe(id,callback){

        ui.ui_block('deleting deal ...');
        $.ajax({
             url : "/mix_match/delete"
            ,type : "POST"
            ,dataType: "json"
            ,data : {id:id}
            ,success : function(data,status_str,xhr) {
                ui.ui_unblock();
                callback(null,data);
            }
            ,error : function(xhr,status_str,err) {
                ui.ui_unblock();
                callback(xhr);
            }
        });
    }

    return {
         exe:exe
    }
});