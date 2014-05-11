define(
[
    'app/store_product/store_product_validator'
]
,function (
	sp_validator
){
    var ERROR_CANCEL_STORE_PRODUCT_PROMPT = 'ERROR_CANCEL_STORE_PRODUCT_PROMPT';
    var MANAGE_SKU_BUTTON_PRESS = 'MANAGE_SKU_BUTTON_PRESS';
    
    function cancel_btn_handler(callback){
        $("#store_product_prompt_dialog").dialog("close");
        callback(ERROR_CANCEL_STORE_PRODUCT_PROMPT/*error*/);
    }

    function manage_sku_btn_handler(callback){
        $("#store_product_prompt_dialog").dialog("close");
        callback(MANAGE_SKU_BUTTON_PRESS/*error*/,null);         
    }

    function ok_btn_handler(is_prompt_sku,callback){
        var result = {
             "name"             : $('#product_name_txt').val()
            ,"price"            : $('#product_price_txt').val()
            ,"is_taxable"       : $('#product_taxable_check').is(':checked')
            ,"is_sale_report"   : $('#product_sale_report_check').is(':checked')
            ,"p_type"           : $('#product_type_txt').val()   
            ,"p_tag"            : $('#product_tag_txt').val()             
            ,"crv"              : $('#product_crv_txt').val()
            ,"sku_str"          : $('#product_sku_txt').val()   
            ,"cost"             : $('#product_cost_txt').val()
            ,"vendor"           : $('#product_vendor_txt').val()      
            ,"buydown"          : $('#product_buydown_txt').val()   
        }

        var error_lst = sp_validator.validate(
             result['name']
            ,result['price']
            ,result['crv']
            ,result['is_taxable']
            ,result['sku_str']
            ,is_prompt_sku
            ,result['cost']
            ,result['vendor']
            ,result['buydown']            
        );
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
        $('#product_cost_txt').removeClass("error");  
        $('#product_buydown_txt').removeClass("error");  

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
        if(error_lst.indexOf(sp_validator.ERROR_STORE_PRODUCT_VALIDATION_COST) != -1){
            $('#product_cost_txt').addClass("error");  
        }
        if(error_lst.indexOf(sp_validator.ERROR_STORE_PRODUCT_VALIDATION_BUYDOWN) != -1){
            $('#product_buydown_txt').addClass("error");  
        }                     
    }

    function populate_ui(
         name_prefill
        ,price_prefill
        ,crv_prefill
        ,is_taxable_prefill
        ,is_sale_report_prefill
        ,p_type_prefill
        ,p_tag_prefill        
        ,sku_prefill
        ,is_prompt_sku
        ,cost_prefill
        ,vendor_prefill        
        ,is_sku_management
        ,buydown_prefill
    ){
        if(is_sku_management){
            $('#sku_management_btn').show();
        }else{
            $('#sku_management_btn').hide();
        }

        $('#product_name_txt').val(name_prefill);
        $('#product_price_txt').val(price_prefill);
        $('#product_crv_txt').val(crv_prefill);
        $('#product_taxable_check').prop('checked', is_taxable_prefill);
        $('#product_sale_report_check').prop('checked', is_sale_report_prefill);
        $('#product_type_txt').val(p_type_prefill);
        $('#product_tag_txt').val(p_tag_prefill);     
        $('#product_cost_txt').val(cost_prefill);     
        $('#product_vendor_txt').val(vendor_prefill);   
        $('#product_buydown_txt').val(buydown_prefill); 

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
    }

	function show_prompt(
	         name_prefill
	        ,price_prefill
	        ,crv_prefill
	        ,is_taxable_prefill
	        ,is_sale_report_prefill
	        ,p_type_prefill
	        ,p_tag_prefill        
	        ,sku_prefill
	        ,is_prompt_sku
	        ,cost
	        ,vendor     
	        ,buydown   
	        ,lookup_type_tag
	        ,is_sku_management
	        ,suggest_product
	        ,callback
		){
			var ok_btn_handler_b = ok_btn_handler.bind(ok_btn_handler,is_prompt_sku,callback);
			var cancel_btn_handler_b = cancel_btn_handler.bind(cancel_btn_handler,callback);

			var html_str = 
 				'<div id="store_product_prompt_dialog">' +
			        '<label for="product_name_txt">Product:</label>' +
			        '<input type="text" id = "product_name_txt">' +
			        '<br>' +
			        '<label for="product_price_txt">Price:</label>' +
			        '<input type="text" id = "product_price_txt">' +
			        '<br>' +
			        '<label for="product_crv_txt">Crv:</label>' +
			        '<input type="text" id = "product_crv_txt">' +
			        '<br>' +
			        '<label for="product_taxable_check">Taxable:</label>' +
			        '<input type="checkbox" id = "product_taxable_check">' +
			        '<br>' +
			        '<label for="product_sale_report_check">Sale report:</label>' +
			        '<input type="checkbox" id = "product_sale_report_check">' +
			        '<br>' +
			        '<label for="product_type_txt">Type:</label>' +
			        '<input type="text" id = "product_type_txt">' +
			        '<br>' +
			        '<label for="product_tag_txt">Tag:</label>' +
			        '<input type="text" id = "product_tag_txt">' +
			        '<br>' +
			        '<label for="product_vendor_txt">Vendor:</label>' +
			        '<input type="text" id = "product_vendor_txt">' +
			        '<br>' +
			        '<label for="product_cost_txt">Cost:</label>' +
			        '<input type="text" id = "product_cost_txt">' +
			        '<br>' +
			        '<label for="product_buydown_txt">Buydown:</label>' +
			        '<input type="text" id = "product_buydown_txt">' +
			        '<br>' +
			        '<label for="product_sku_txt">Sku:</label>' +
			        '<input type="text" id = "product_sku_txt">' +
			        '<br>' +
			        '<input type="button" id = "sku_management_btn" value = "manage sku">' +
			        '<br>' +
			    '</div>';
			
			var title = (suggest_product == null ? 'create new product' : 'add: ' + suggest_product.name);
			

			$(html_str).appendTo('body')
	    		// .html(html_str)
	 			.dialog(
	    		{
			        modal: true,
			        title: title,
			        zIndex: 10000,
			        autoOpen: true,
			        width: 600,
			        buttons: {
			            Yes: ok_btn_handler_b,
			            No: cancel_btn_handler_b
	        		},
					open: function( event, ui ) 
					{
				        $('#store_product_prompt_dialog').keypress(function(e) {
				            if (e.keyCode == $.ui.keyCode.ENTER) {
				                ok_btn_handler(is_prompt_sku,callback);
				            }
				        });

				        var manage_sku_btn_handler_b = manage_sku_btn_handler.bind(manage_sku_btn_handler,callback);
				        $('#sku_management_btn').off('click').click(manage_sku_btn_handler_b);        

				        populate_ui
				        (
				             name_prefill
				            ,price_prefill
				            ,crv_prefill
				            ,is_taxable_prefill
				            ,is_sale_report_prefill
				            ,p_type_prefill
				            ,p_tag_prefill
				            ,sku_prefill
				            ,is_prompt_sku
				            ,cost
				            ,vendor            
				            ,is_sku_management
				            ,buydown
				        );

				        //auto complete for product type and tag
				        if(lookup_type_tag){
				            var type_lst = Object.keys(lookup_type_tag)
				            $('#product_type_txt').on('autocompletechange', function() {
				                var tag_lst = lookup_type_tag[$(this).val()];
				                if(tag_lst == undefined){
				                    tag_lst = [];
				                }
				                $( "#product_tag_txt" ).autocomplete({
				                     source: tag_lst
				                    ,minLength: 0
				                })
				                .bind('focus', function () {
				                    $(this).autocomplete("search");
				                });
				            });
				            $( "#product_type_txt" ).autocomplete({
				                 source: type_lst
				                ,minLength: 0
				            })
				            .bind('focus', function () {
				                $(this).autocomplete("search");
				            });            
				        }
					},        		
			        close: function (event, ui) {
			            $(this).remove();
			        }
	    		});			
		};

    return{
         ERROR_CANCEL_STORE_PRODUCT_PROMPT : ERROR_CANCEL_STORE_PRODUCT_PROMPT
        ,MANAGE_SKU_BUTTON_PRESS : MANAGE_SKU_BUTTON_PRESS
        ,show_prompt:show_prompt
    }
});