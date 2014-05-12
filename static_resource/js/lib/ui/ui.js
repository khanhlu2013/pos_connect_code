define(
[
     'jquery'
    ,'jquery_ui'
]
,function
(

)
{
	function ui_alert(message){
		$('<div></div>').appendTo('body')
    		.html('<div><h6>' + message + '</h6></div>')
    		.dialog(
    		{
		        modal: true,
		        title: 'info',
		        zIndex: 10000,
		        autoOpen: true,
		        width: 'auto',
		        resizable: false,
		        buttons: {
		            Ok: function () {
		                $(this).dialog("close");
		            }
        		},
		        close: function (event, ui) {
		            $(this).remove();
		        }
    		});	
	}

 	function ui_confirm(message,yes_func,no_func){
		$('<div></div>').appendTo('body')
    		.html('<div><h6>' + message + '</h6></div>')
    		.dialog(
    		{
		        modal: true,
		        title: 'confirm',
		        zIndex: 10000,
		        autoOpen: true,
		        width: 'auto',
		        resizable: false,
		        buttons: {
		            Yes: function () {
		            	yes_func();
		                $(this).dialog("close");
		            },
		            No: function () {
		            	no_func();
		                $(this).dialog("close");
		            }
        		},
		        close: function (event, ui) {
		            $(this).remove();
		        }
    		});		
	}

	return {
		ui_confirm:ui_confirm
		,ui_alert:ui_alert
	}
});