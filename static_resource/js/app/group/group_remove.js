define(
[
	'lib/ui/ui'
]
,function
(
	ui
)
{
	function exe(id,callback){
        ui.ui_block('updating group ...');
        $.ajax({
             url : "/group/remove"
            ,type : "POST"
            ,dataType: "json"
            ,data : {id:id}
            ,success : function(data,status_str,xhr) {
                ui.ui_unblock();
                callback(null,data/*boolean*/);
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