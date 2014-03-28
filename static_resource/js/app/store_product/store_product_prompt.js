define(
    [
        'app/store_product/store_product_validator'
    ]
    ,function
    (
        sp_validator
    )
{

    var selected_suggest_product = null;
    var STORE_PRODUCT_PROMPT_ERROR_CANCEL_BUTTON_PRESS = "STORE_PRODUCT_PROMPT_ERROR_CANCEL_BUTTON_PRESS";

    function cancel_btn_handler(callback){
        $("#store_product_prompt_dialog").dialog("close");
        callback(STORE_PRODUCT_PROMPT_ERROR_CANCEL_BUTTON_PRESS/*error*/);
    }

    function ok_btn_handler(is_prompt_sku,callback){
        var result = {
             "name"         : $('#product_name_txt').val()
            ,"price"        : $('#product_price_txt').val()
            ,"is_taxable"   : $('#product_taxable_check').is(':checked')
            ,"crv"          : $('#product_crv_txt').val()
            ,"sku_str"      : $('#product_sku_txt').val()   
            ,"product_id"   : (selected_suggest_product == null ? null : selected_suggest_product.id)
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

    function helper_fill_form(name,price,crv,is_taxable){
        $('#product_name_txt').val(name);
        $('#product_price_txt').val(price);
        $('#product_taxable_check').prop('checked', is_taxable);
        $('#product_crv_txt').val(crv);
    }

    function populate_ui(name_prefill,price_prefill,crv_prefill,is_taxable_prefill,sku_prefill,is_prompt_sku,suggest_product_lst){
        helper_fill_form(name_prefill,price_prefill,crv_prefill,is_taxable_prefill);
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

        //SUGGEST PRODUCT LIST
        $('#suggest_product_lst').html('');
        if(suggest_product_lst!=null){
            for(var i = 0;i<suggest_product_lst.length;i++){
                $('<input type="radio" name = "select_product" value = "' + i + '"id="' + i + '"><label for="' + i + '">' + suggest_product_lst[i].name +  '</label>').appendTo("#suggest_product_lst");
                $('#suggest_product_lst').append("<br/>");
            }
            $('<input type="radio" id="create_new" name = "select_product" value = -1><label for="create_new">Create new product</label>').appendTo("#suggest_product_lst");
            $('#suggest_product_lst').append("<br/>");
            $('#suggest_product_lst').append("<br/>");

            $("input:radio[name=select_product]").click(function() {
                var value = $(this).val();
                if(value == '-1'){
                    selected_suggest_product = null;
                }else{
                    selected_suggest_product = suggest_product_lst[value];
                }
                helper_fill_form(selected_suggest_product == null ? null : selected_suggest_product.name/*name*/,null/*price*/,null/*crv*/,null/*is_taxable*/);
            });

            $("#0").attr('checked', true).trigger('click');//select the first item
        }
    }

    function show_prompt
    (
         name_prefill
        ,price_prefill
        ,crv_prefill
        ,is_taxable_prefill
        ,sku_prefill
        ,is_prompt_sku
        ,suggest_product_lst
        ,callback
    ){

        //ok cancel button
        var ok_btn_handler_b = ok_btn_handler.bind(ok_btn_handler,is_prompt_sku,callback);
        var cancel_btn_handler_b = cancel_btn_handler.bind(cancel_btn_handler,callback);
        $('#store_product_prompt_dialog').dialog({ buttons: [ { text: "Ok", click: ok_btn_handler_b },{ text: "Cancel", click: cancel_btn_handler_b } ] });

        populate_ui
        (
             name_prefill
            ,price_prefill
            ,crv_prefill
            ,is_taxable_prefill
            ,sku_prefill
            ,is_prompt_sku
            ,suggest_product_lst
        );

        //show dialog
        $('#store_product_prompt_dialog').dialog('open');
    }

    return{
         STORE_PRODUCT_PROMPT_ERROR_CANCEL_BUTTON_PRESS : STORE_PRODUCT_PROMPT_ERROR_CANCEL_BUTTON_PRESS
        ,show_prompt:show_prompt
    }
});