define(
[
    'lib/number/number'
]
,function
(
	number
)
{

	function ok_btn_handler(callback){
		price = $('#non_inventory_price_txt').val();
		description = $('#non_inventory_description_txt').val();

		if(!number.is_positive_double(price)){
			alert('check price input');
			return;
		}

		var result={price:price,description:description};
		callback(null,result);
		$('#non_inventory_prompt_dialog').dialog('close');
	}

	function cancel_btn_handler(callback){
		callback('ERROR_CANCEL_NON_INVENTORY_PROMPT_CANCEL');
		$('#non_inventory_prompt_dialog').dialog('close');
	}

	function exe(callback){
        //ok cancel sku_management button
        var ok_btn_handler_b = ok_btn_handler.bind(ok_btn_handler,callback);
        var cancel_btn_handler_b = cancel_btn_handler.bind(cancel_btn_handler,callback);
        var title = 'non inventory'
        $('#non_inventory_prompt_dialog').dialog({
             title:title
            ,buttons: [ { text: "Ok", click: ok_btn_handler_b },{ text: "Cancel", click: cancel_btn_handler_b } ]
            ,modal : true
            ,width : 600
            ,heigh : 400
        });
        $('#non_inventory_price_txt').val('');
        $('#non_inventory_description_txt').val('');
		$('#non_inventory_prompt_dialog').dialog('open');
	}

	return{
		exe:exe
	}
});