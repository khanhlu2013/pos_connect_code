define(
[
     'app/store_product/store_product_validator'
    ,'app/product/product_json_helper' 
]
,function (
     sp_validator
    ,product_json_helper
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
            var name_raw             = $('#product_name_txt').val()
            var price_raw            = $('#product_price_txt').val()
            var is_taxable_raw       = $('#product_taxable_check').is(':checked')
            var is_sale_report_raw   = $('#product_sale_report_check').is(':checked')
            var p_type_raw           = $('#product_type_txt').val()   
            var p_tag_raw            = $('#product_tag_txt').val()             
            var crv_raw              = $('#product_crv_txt').val()
            var sku_str_raw          = $('#product_sku_txt').val()   
            var cost_raw             = $('#product_cost_txt').val()
            var vendor_raw           = $('#product_vendor_txt').val()      
            var buydown_raw          = $('#product_buydown_txt').val()  

            var name             = name_raw.trim().length == 0 ? null : name_raw.trim();
            var price            = price_raw.trim().length == 0 ? null : price_raw.trim();
            var is_taxable       = is_taxable_raw;
            var is_sale_report   = is_sale_report_raw;
            var p_type           = p_type_raw.trim().length == 0 ? null : p_type_raw.trim();
            var p_tag            = p_tag_raw.trim().length == 0 ? null : p_tag_raw.trim();       
            var crv              = crv_raw.trim().length == 0 ? null : crv_raw.trim();
            var sku_str          = sku_str_raw.trim().length == 0 ? null : sku_str_raw.trim();
            var cost             = cost_raw.trim().length == 0 ? null : cost_raw.trim();
            var vendor           = vendor_raw.trim().length == 0 ? null : vendor_raw.trim();  
            var buydown          = buydown_raw.trim().length == 0 ? null : buydown_raw.trim();

        var result = {
             "name"             : name
            ,"price"            : price
            ,"is_taxable"       : is_taxable
            ,"is_sale_report"   : is_sale_report
            ,"p_type"           : p_type
            ,"p_tag"            : p_tag           
            ,"crv"              : crv
            ,"sku_str"          : sku_str
            ,"cost"             : cost
            ,"vendor"           : vendor   
            ,"buydown"          : buydown
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
            ,cost_prefill
            ,vendor_prefill     
            ,buydown_prefill   
            ,lookup_type_tag
            ,is_sku_management
            ,suggest_product
            ,callback
        ){
            var ok_btn_handler_b = ok_btn_handler.bind(ok_btn_handler,is_prompt_sku,callback);
            var cancel_btn_handler_b = cancel_btn_handler.bind(cancel_btn_handler,callback);

            var html_str = 
                '<div id="store_product_prompt_dialog">' +
                    '<label for="product_name_txt">Name:</label>' +
                    '<input type="text" id = "product_name_txt" style="width:500px;">' +
                    '<input type="button" id = "suggest_name_btn" value = "same">' +
                    '<br>' +
                    '<label for="product_price_txt">Price:</label>' +
                    '<input type="text" id = "product_price_txt">' +
                    '<input type="button" id = "suggest_price_btn">' +                      
                    '<br>' +
                    '<label for="product_crv_txt">Crv:</label>' +
                    '<input type="text" id = "product_crv_txt">' +
                    '<input type="button" id = "suggest_crv_btn">' +                    
                    '<br>' +
                    '<label for="product_taxable_check">Taxable:</label>' +
                    '<input type="checkbox" id = "product_taxable_check">' +
                    '<br>' +
                    '<label for="product_cost_txt">Cost:</label>' +
                    '<input type="text" id = "product_cost_txt">' +
                    '<input type="button" id = "suggest_cost_btn">' +                   
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
                    '<label for="product_buydown_txt">Buydown:</label>' +
                    '<input type="text" id = "product_buydown_txt">' +
                    '<br>' +
                    '<label for="product_sku_txt">Sku:</label>' +
                    '<input type="text" id = "product_sku_txt">' +
                    '<br>' +
                    '<input type="button" id = "sku_management_btn" value = "manage sku">' +
                    '<br>' +
                '</div>';
            
            $(html_str).appendTo('body')
                .dialog(
                {
                    modal: true,
                    title: (suggest_product == null ? 'create new product' : 'add: ' + suggest_product.name),
                    zIndex: 10000,
                    autoOpen: true,
                    width: 650,
                    buttons: {
                        Yes: ok_btn_handler_b,
                        No: cancel_btn_handler_b
                    },
                    open: function( event, ui ) 
                    {
                        if(suggest_product){
                            //name
                            $('#suggest_name_btn').click(function(){
                                $('#product_name_txt').val(suggest_product.name);                           
                            }); 

                            //price
                            var suggest_price = product_json_helper.get_suggest_info('price',suggest_product);
                            if(suggest_price){
                                $('#suggest_price_btn').val(suggest_price);             
                                $('#suggest_price_btn').click(function(){
                                    $('#product_price_txt').val(suggest_price);                             
                                });                                 
                            }else{
                                $('#suggest_price_btn').hide();
                            }
                                
                            //crv
                            var suggest_crv = product_json_helper.get_suggest_info('crv',suggest_product);
                            if(suggest_crv){
                                $('#suggest_crv_btn').val(suggest_crv);
                                $('#suggest_crv_btn').click(function(){
                                    $('#product_crv_txt').val(suggest_crv);                             
                                });                             
                            }else{
                                $('#suggest_crv_btn').hide();
                            }

                            //cost
                            var suggest_cost = product_json_helper.get_suggest_info('cost',suggest_product);
                            if(suggest_cost){
                                $('#suggest_cost_btn').val(suggest_cost);
                                $('#suggest_cost_btn').click(function(){
                                    $('#product_cost_txt').val(suggest_cost);                               
                                });                                 
                            }else{
                                $('#suggest_cost_btn').hide();
                            }
                        }else{
                            $('#suggest_name_btn').hide();
                            $('#suggest_price_btn').hide();
                            $('#suggest_crv_btn').hide();
                            $('#suggest_cost_btn').hide();
                        }

                        $('#store_product_prompt_dialog').keypress(function(e) {
                            if (e.keyCode == $.ui.keyCode.ENTER) {
                                ok_btn_handler(is_prompt_sku,callback);
                            }
                        });

                        var manage_sku_btn_handler_b = manage_sku_btn_handler.bind(manage_sku_btn_handler,callback);
                        $('#sku_management_btn').click(manage_sku_btn_handler_b);        

                        if(is_sku_management){
                            $('#sku_management_btn').show();
                        }else{
                            $('#sku_management_btn').hide();
                        }

                        if(is_sale_report_prefill == null){
                            is_sale_report_prefill = true;
                        }

                        if(is_taxable_prefill == null){
                            if(suggest_product){
                                is_taxable_prefill = product_json_helper.get_suggest_info('is_taxable',suggest_product);
                            }else{
                                is_taxable_prefill = false;
                            }
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