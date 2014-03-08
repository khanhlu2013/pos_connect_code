define(
	[
		'app/store_product/store_product_validator'
	]
	,function
	(
		sp_validator
	)
{

	var selected_approve_product = null;
	var STORE_PRODUCT_PROMPT_ERROR_CANCEL_BUTTON_PRESS = "STORE_PRODUCT_PROMPT_ERROR_CANCEL_BUTTON_PRESS";

 	function cancel_button_handler(callback){
 		$("#store_product_prompt_dialog").dialog("close");
 		callback(STORE_PRODUCT_PROMPT_ERROR_CANCEL_BUTTON_PRESS/*error*/);
	}

	function ok_button_handler(is_prompt_sku,callback){
 		var result = {
			 "name" 		: $('#product_name_txt').val()
			,"price" 		: $('#product_price_txt').val()
			,"is_taxable"	: $('#product_taxable_check').is(':checked')
			,"crv"			: $('#product_crv_txt').val()
			,"sku_str"		: $('#product_sku_txt').val()	
			,"product_id"	: (selected_approve_product == null ? null : selected_approve_product.product_id)
		}

 		var error_lst = sp_validator.validate(result['name'],result['price'],result['crv'],result['is_taxable'],result['sku_str'],is_prompt_sku);
 		if(error_lst.length!=0){
 			set_validation_indicator(error_lst)
 			return;
 		}else{
			$("#store_product_prompt_dialog").dialog("close");
	 		callback(null/*error*/,result); 			
 		}
 	}

	function set_validation_indicator(error_lst){
		$('#product_name_txt').removeClass("error");  
		$('#product_price_txt').removeClass("error");  
		$('#product_crv_txt').removeClass("error");  
		$('#product_sku_txt').removeClass("error");  

		if(error_lst.indexOf(sp_validator.ERROR_STORE_PRODUCT_VALIDATION_NAME) != -1){
			$('#product_name_txt').addClass("error");  
		}

		if(error_lst.indexOf(sp_validator.ERROR_STORE_PRODUCT_VALIDATION_PRICE) != -1){
			$('#product_price_txt').addClass("error");  
		}

		if(error_lst.indexOf(sp_validator.ERROR_STORE_PRODUCT_VALIDATION_CRV) != -1){
			$('#product_crv_txt').addClass("error");  
		}

		if(error_lst.indexOf(sp_validator.ERROR_STORE_PRODUCT_VALIDATION_SKU) != -1){
			$('#product_sku_txt').addClass("error");  
		}
 	}

	function fill_form(name,price,crv,is_taxable){
		$('#product_name_txt').val(name);
		$('#product_price_txt').val(price);
 		$('#product_taxable_check').prop('checked', is_taxable);
		$('#product_crv_txt').val(crv);
	}

	function reset_ui(name_prefill,price_prefill,crv_prefill,is_taxable_prefill,sku_prefill,is_prompt_sku,approve_product_lst){
		fill_form(name_prefill,price_prefill,crv_prefill,is_taxable_prefill);
		set_validation_indicator([]);
		
		//SKU INFO
		if(is_prompt_sku){
			$('#product_sku_txt').show();
			$('label[for="product_sku_txt"]').show();	
	 		$('#product_sku_txt').val(sku_prefill);
			$('#product_sku_txt').attr('readonly', sku_prefill!=null);		
		}else{
			$('#product_sku_txt').hide();
			$('label[for="product_sku_txt"]').hide();
 		}

		$('#approve_product_lst').html('');
		if(approve_product_lst!=null){
 			for(var i = 0;i<approve_product_lst.length;i++){
				$('<input type="radio" name = "select_product" value = "' + i + '"id="' + i + '"><label for="' + i + '">' + approve_product_lst[i].name +  '</label>').appendTo("#approve_product_lst");
				$('#approve_product_lst').append("<br/>");
			}
			$('<input type="radio" id="create_new" name = "select_product" value = -1><label for="create_new">Create new product</label>').appendTo("#approve_product_lst");
			$('#approve_product_lst').append("<br/>");
			$('#approve_product_lst').append("<br/>");

			$("input:radio[name=select_product]").click(function() {
 				var value = $(this).val();
			    if(value == '-1'){
			    	selected_approve_product = null;
 				}else{
			    	selected_approve_product = approve_product_lst[value];
			    }
			    fill_form(selected_approve_product == null ? null : selected_approve_product.name/*name*/,null/*price*/,null/*crv*/,null/*is_taxable*/);
			});
			$("#0").attr('checked', true).trigger('click');
		}
 	}

	function exe(name_prefill,price_prefill,crv_prefill,is_taxable_prefill,sku_prefill,is_prompt_sku,approve_product_lst,callback){

		reset_ui(name_prefill,price_prefill,crv_prefill,is_taxable_prefill,sku_prefill,is_prompt_sku,approve_product_lst);
		$( "#store_product_prompt_dialog" ).dialog("open");
		var ok_button_handler_b = ok_button_handler.bind(ok_button_handler,is_prompt_sku,callback);
		var cancel_button_handler_b = cancel_button_handler.bind(cancel_button_handler,callback);
		
		$( "#store_product_prompt_dialog" ).dialog({ buttons: [ { text: "Ok", click: ok_button_handler_b },{ text: "Cancel", click: cancel_button_handler_b } ] });
	}

	return{
		 STORE_PRODUCT_PROMPT_ERROR_CANCEL_BUTTON_PRESS : STORE_PRODUCT_PROMPT_ERROR_CANCEL_BUTTON_PRESS
		,exe:exe
	}
});