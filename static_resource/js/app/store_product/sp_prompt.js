define(
    [
        'app/store_product/store_product_validator'
    ]
    ,function
    (
        sp_validator
    )
{
        
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

    function helper_fill_form(
         name
        ,price
        ,crv
        ,is_taxable
        ,is_sale_report
        ,p_type
        ,p_tag
        ,cost
        ,vendor
        ,buydown
    ){
        $('#product_name_txt').val(name);
        $('#product_price_txt').val(price);
        $('#product_crv_txt').val(crv);
        $('#product_taxable_check').prop('checked', is_taxable);
        $('#product_sale_report_check').prop('checked', is_sale_report);
        $('#product_type_txt').val(p_type);
        $('#product_tag_txt').val(p_tag);     
        $('#product_cost_txt').val(cost);     
        $('#product_vendor_txt').val(vendor);   
        $('#product_buydown_txt').val(buydown);        
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
        
        helper_fill_form(
             name_prefill
            ,price_prefill
            ,crv_prefill
            ,is_taxable_prefill
            ,is_sale_report_prefill
            ,p_type_prefill
            ,p_tag_prefill
            ,cost_prefill
            ,vendor_prefill
            ,buydown_prefill
        );
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

    function show_prompt
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
        ,buydown   
        ,lookup_type_tag
        ,is_sku_management
        ,suggest_product
        ,callback
    ){
        //ok cancel sku_management button
        var ok_btn_handler_b = ok_btn_handler.bind(ok_btn_handler,is_prompt_sku,callback);
        var cancel_btn_handler_b = cancel_btn_handler.bind(cancel_btn_handler,callback);
        var title = (suggest_product == null ? 'create new product' : 'create product ' + suggest_product.name);
        $('#store_product_prompt_dialog').dialog({
             title:title
            ,buttons: [ { text: "Ok", click: ok_btn_handler_b },{ text: "Cancel", click: cancel_btn_handler_b } ]
            ,modal : true
            ,width : 600
            ,heigh : 400
        });

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

        //show dialog
        $('#store_product_prompt_dialog').dialog('open');
    }

    return{
         ERROR_CANCEL_STORE_PRODUCT_PROMPT : ERROR_CANCEL_STORE_PRODUCT_PROMPT
        ,MANAGE_SKU_BUTTON_PRESS : MANAGE_SKU_BUTTON_PRESS
        ,show_prompt:show_prompt
    }
});