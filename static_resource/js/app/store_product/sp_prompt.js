define(
[
     'app/store_product/store_product_validator'
    ,'app/product/product_json_helper' 
    ,'app/store_product/sp_json_helper'
    ,'lib/ui/table'
    ,'lib/ui/button'
    ,'lib/ajax_helper'
    ,'lib/async'
    ,'lib/error_lib'
]
,function (
     sp_validator
    ,product_json_helper
    ,sp_json_helper
    ,ui_table
    ,ui_button
    ,ajax_helper
    ,async
    ,error_lib
){
    var ERROR_CANCEL_STORE_PRODUCT_PROMPT = 'ERROR_CANCEL_STORE_PRODUCT_PROMPT';
    var MANAGE_SKU_BUTTON_PRESS = 'MANAGE_SKU_BUTTON_PRESS';
    var MANAGE_GROUP_BUTTON_PRESS = 'MANAGE_GROUP_BUTTON_PRESS';
    var MANAGE_KIT_BUTTON_PRESS = 'MANAGE_KIT_BUTTON_PRESS';
    var DUPLICATE_BUTTON_PRESS = 'DUPLICATE_BUTTON_PRESS';

    function cancel_btn_handler(callback){
        $("#store_product_prompt_dialog").dialog("close");
        callback(ERROR_CANCEL_STORE_PRODUCT_PROMPT/*error*/);
    }
    function sku_click_handler(callback){
        $("#store_product_prompt_dialog").dialog("close");
        callback(MANAGE_SKU_BUTTON_PRESS);                       
    }
    function group_click_handler(callback){
        $("#store_product_prompt_dialog").dialog("close");
        callback(MANAGE_GROUP_BUTTON_PRESS);                       
    }
    function kit_click_handler(callback){
        $("#store_product_prompt_dialog").dialog("close");
        callback(MANAGE_KIT_BUTTON_PRESS);                       
    }
    function duplicate_click_handler(callback){
        $("#store_product_prompt_dialog").dialog("close");
        callback(DUPLICATE_BUTTON_PRESS);                       
    }

    function ok_btn_handler(is_prompt_sku,callback){
            var name_raw                    = $('#product_name_txt').val()
            var price_raw                   = $('#product_price_txt').val()
            var value_customer_price_raw    = $('#product_value_customer_price_txt').val()             
            var is_taxable_raw              = $('#product_taxable_check').is(':checked')
            var is_sale_report_raw          = $('#product_sale_report_check').is(':checked')
            var p_type_raw                  = $('#product_type_txt').val()   
            var p_tag_raw                   = $('#product_tag_txt').val()             
            var crv_raw                     = $('#product_crv_txt').val()
            var sku_str_raw                 = $('#product_sku_txt').val()   
            var cost_raw                    = $('#product_cost_txt').val()
            var vendor_raw                  = $('#product_vendor_txt').val()      
            var buydown_raw                 = $('#product_buydown_txt').val()  

            var name                    = name_raw.trim().length == 0 ? null : name_raw.trim();
            var price                   = price_raw.trim().length == 0 ? null : price_raw.trim();
            var value_customer_price    = value_customer_price_raw.trim().length == 0 ? null : value_customer_price_raw.trim();            
            var is_taxable              = is_taxable_raw;
            var is_sale_report          = is_sale_report_raw;
            var p_type                  = p_type_raw.trim().length == 0 ? null : p_type_raw.trim();
            var p_tag                   = p_tag_raw.trim().length == 0 ? null : p_tag_raw.trim();       
            var crv                     = crv_raw.trim().length == 0 ? null : crv_raw.trim();
            var sku_str                 = sku_str_raw.trim().length == 0 ? null : sku_str_raw.trim();
            var cost                    = cost_raw.trim().length == 0 ? null : cost_raw.trim();
            var vendor                  = vendor_raw.trim().length == 0 ? null : vendor_raw.trim();  
            var buydown                 = buydown_raw.trim().length == 0 ? null : buydown_raw.trim();

        var result = {
             "name"                 : name
            ,"price"                : price
            ,"value_customer_price" : value_customer_price            
            ,"is_taxable"           : is_taxable
            ,"is_sale_report"       : is_sale_report
            ,"p_type"               : p_type
            ,"p_tag"                : p_tag           
            ,"crv"                  : crv
            ,"sku_str"              : sku_str
            ,"cost"                 : cost
            ,"vendor"               : vendor   
            ,"buydown"              : buydown

        }

        var error_lst = sp_validator.validate(
             result['name']
            ,result['price']
            ,result['value_customer_price']               
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
        $('#product_value_customer_price_txt').removeClass("error");  

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
        if(error_lst.indexOf(sp_validator.ERROR_STORE_PRODUCT_VALIDATION_VALUE_CUSTOMER_PRICE) != -1){
            $('#product_value_customer_price_txt').addClass("error");  
        }                      
    }

    function display_kit_data(cur_sp){

        if(cur_sp.breakdown_assoc_lst === undefined){
            return;
        }

        if(cur_sp.breakdown_assoc_lst.length == 0){
            return;
        }

        var tbl = document.getElementById('kit_tbl');
        tbl.innertHTML = "";
        var tr;var td;

        for(var i = 0;i<cur_sp.breakdown_assoc_lst.length;i++){
            var tr = tbl.insertRow(-1);
            var assoc = cur_sp.breakdown_assoc_lst[i];

            var td = tr.insertCell(-1);
            td.innerHTML = assoc.breakdown.name;

            var td = tr.insertCell(-1);
            td.innerHTML = assoc.qty;            
        }
        var col_info_lst = 
        [
            {caption:"kit",width:60},
            {caption:"qty",width:20},
        ];
        ui_table.set_header(col_info_lst,tbl);
    }

    function display_group_data(cur_sp){
        if(cur_sp.group_lst.length == 0){
            return;
        }

        var tbl = document.getElementById('group_tbl');
        var tr;var td;
        for(var i = 0;i<cur_sp.group_lst.length;i++){
            var tr = tbl.insertRow(-1);
            var group = cur_sp.group_lst[i];

            var td = tr.insertCell(-1);
            td.innerHTML = group.name;
        }
        var col_info_lst = 
        [
            {caption:"group",width:70},
        ];
        ui_table.set_header(col_info_lst,tbl);        
    }

    function show_prompt(
             cur_sp//current sp that we are editing
            ,sp_duplicate//scenario when we are duplicating sp
            ,is_prompt_sku
            ,sku_prefill
            ,is_get_lookup_type_tag_online
            ,suggest_product//this sp is used in a scenario where we are adding this product (using the same pid) to our store. when this sp is not null, the user have an option to click on buttons to use same name,price,crv,cost
            ,callback
        ){
            var is_product_exist = (cur_sp != null && cur_sp.product_id != null);

            //HTML
            var html_str = 
                '<div id="store_product_prompt_dialog">' +
                    '<div class="form-horizontal">' +

                        '<div class="form-group">' +
                            '<label for="product_name_txt" class="col-sm-4 control-label" >Name:</label>' +
                            '<div class="col-sm-8">' +
                                '<input type="text" id = "product_name_txt">' +
                                '<input type="button" id = "suggest_name_btn" value = "same">' +                            
                            '</div>' +
                        '</div>' +

                        '<div class="form-group">' +
                            '<label for="product_price_txt" class="col-sm-4 control-label">Price:</label>' +
                            '<div class="col-sm-8">' +
                                '<input type="text" id = "product_price_txt">' +
                                '<input type="button" id = "suggest_price_btn">' +                                 
                            '</div>' +
                        '</div>' +
   
                        '<div class="form-group">' +
                            '<label for="product_crv_txt" class="col-sm-4 control-label">Crv:</label>' +
                            '<div class="col-sm-8">' +
                                '<input type="text" id = "product_crv_txt">' +
                                '<input type="button" id = "suggest_crv_btn">' +     
                                '<label id="_compute_crv_lbl"></label>' +                             
                            '</div>' +
                        '</div>' +

                        '<div class="form-group">' +
                            '<label for="product_taxable_check" class="col-sm-4 control-label">Taxable:</label>' +
                            '<div class="col-sm-8">' +
                                '<input type="checkbox" id = "product_taxable_check">' +
                            '</div>' +
                        '</div>' +

                        '<div class="form-group">' +
                            '<label for="product_cost_txt" class="col-sm-4 control-label">Cost:</label>' +
                            '<div class="col-sm-8">' +
                                '<input type="text" id = "product_cost_txt">' +
                                '<input type="button" id = "suggest_cost_btn">' +     
                                '<label id="_compute_cost_lbl"></label>' +                             
                            '</div>' +
                        '</div>' +

                        '<div class="form-group">' +
                            '<label for="product_sale_report_check" class="col-sm-4 control-label">Sale report:</label>' +
                            '<div class="col-sm-8">' +
                                '<input type="checkbox" id = "product_sale_report_check">' +
                            '</div>' +
                        '</div>' +

                        '<div class="form-group">' +
                            '<label for="product_type_txt" class="col-sm-4 control-label">Type:</label>' +
                            '<div class="col-sm-8">' +
                                '<input type="text" id = "product_type_txt">' +
                            '</div>' +
                        '</div>' +

                        '<div class="form-group">' +
                            '<label for="product_tag_txt" class="col-sm-4 control-label">Tag:</label>' +
                            '<div class="col-sm-8">' +
                                '<input type="text" id = "product_tag_txt">' +
                            '</div>' +
                        '</div>' +

                        '<div class="form-group">' +
                            '<label for="product_vendor_txt" class="col-sm-4 control-label">Vendor:</label>' +
                            '<div class="col-sm-8">' +
                                '<input type="text" id = "product_vendor_txt">' +
                            '</div>' +    
                        '</div>' +

                        '<div class="form-group">' +
                            '<label for="product_buydown_txt" class="col-sm-4 control-label">Buydown:</label>' +
                            '<div class="col-sm-8">' +
                                '<input type="text" id = "product_buydown_txt">' +
                                '<label id="_compute_buydown_lbl"></label>' +                     
                            '</div>' +
                        '</div>' +

                        '<div class="form-group">' +
                            '<label for="product_value_customer_price_txt" class="col-sm-4 control-label">value customer price:</label>' +
                            '<div class="col-sm-8">' +
                                '<input type="text" id = "product_value_customer_price_txt">' +
                            '</div>' +
                        '</div>' +

                        '<div class="form-group">' +
                            '<label for="product_sku_txt" class="col-sm-4 control-label">Sku:</label>' +
                            '<div class="col-sm-8">' +
                                '<input type="text" id = "product_sku_txt">' +
                            '</div>' +
                        '</div>' +
                        '<table id="group_tbl" class="table table-hover table-bordered table-condensed table-striped table-side-by-side"></table>' +
                        '<table id="kit_tbl" class="table table-hover table-bordered table-condensed table-striped table-side-by-side"></table>' +
                    '</div>' +                                 
                '</div>';

            //TITLE
            var title = null;
            if(cur_sp){
                title = 'edit ' + cur_sp.name;
            }else{
                if(suggest_product){
                    title = 'add: ' + suggest_product.name;
                }else{
                    title = 'create new product';
                }
            }

            //BUTTONS
            var ok_btn_handler_b = ok_btn_handler.bind(ok_btn_handler,is_prompt_sku,callback);
            var cancel_btn_handler_b = cancel_btn_handler.bind(cancel_btn_handler,callback);
            var sku_click_handler_b = sku_click_handler.bind(sku_click_handler,callback);
            var group_click_handler_b = group_click_handler.bind(group_click_handler,callback);
            var kit_click_handler_b = kit_click_handler.bind(group_click_handler,callback);
            var duplicate_click_handler_b = duplicate_click_handler.bind(duplicate_click_handler,callback);
            var buttons =
            {
                ok_btn : {id: '_sp_prompt_ok_btn', click:ok_btn_handler_b},
                cancel_btn : {id: '_sp_prompt_cancel_btn', click:cancel_btn_handler_b}
            }
            if(is_product_exist){
                buttons['sku_btn'] = {id: '_sp_prompt_sku_btn',click:sku_click_handler_b,text:'sku'};
                buttons['group_btn'] = {id: '_sp_prompt_group_btn',click:group_click_handler_b, text:'group'};
                buttons['kit_btn'] = {id: '_sp_prompt_kit_btn',click:kit_click_handler_b, text:'kit'};
                buttons['duplicate_btn'] = {id: '_sp_prompt_duplicate_btn',click:duplicate_click_handler_b, text:'duplicate'};
            }

            $(html_str).appendTo('body')
                .dialog(
                {
                    modal: true,
                    title: title,
                    zIndex: 10000,
                    autoOpen: true,
                    width: 650,
                    buttons: buttons,
                    create   : function(ev, ui) {
                        $(this).parent().find('.ui-dialog-buttonset').css({'width':'100%','text-align':'right'});
                        $(this).parent().find('button:contains("sku")').css({'float':'left'});
                        $(this).parent().find('button:contains("group")').css({'float':'left'});
                        $(this).parent().find('button:contains("kit")').css({'float':'left'});
                        $(this).parent().find('button:contains("duplicate")').css({'float':'left'});
                    },
                    open: function( event, ui ) 
                    {
                        ui_button.set_css('_sp_prompt_ok_btn','green','ok',true);
                        ui_button.set_css('_sp_prompt_cancel_btn','orange','remove',true);
                        if(is_product_exist){
                            ui_button.set_css('_sp_prompt_sku_btn','blue',null/*glyphicon*/,true);
                            ui_button.set_css('_sp_prompt_group_btn','blue',null/*glyphicon*/,true);
                            ui_button.set_css('_sp_prompt_kit_btn','blue',null/*glyphicon*/,true);
                            ui_button.set_css('_sp_prompt_duplicate_btn','blue',null/*glyphicon*/,true);
                        }
                                    
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

                        if(cur_sp!=null){
                            $('#product_name_txt').val(cur_sp.name);
                            $('#product_price_txt').val(cur_sp.price);
                            $('#product_value_customer_price_txt').val(cur_sp.value_customer_price);                             
                            $('#product_crv_txt').val(cur_sp.crv);
                            $('#product_taxable_check').prop('checked', cur_sp.is_taxable);
                            $('#product_sale_report_check').prop('checked', cur_sp.is_sale_report);
                            $('#product_type_txt').val(cur_sp.p_type);
                            $('#product_tag_txt').val(cur_sp.p_tag);     
                            $('#product_cost_txt').val(cur_sp.cost);     
                            $('#product_vendor_txt').val(cur_sp.vendor);   
                            $('#product_buydown_txt').val(cur_sp.buydown); 

                            if(cur_sp.breakdown_assoc_lst != undefined && cur_sp.breakdown_assoc_lst.length != 0){
                                $('#product_crv_txt').attr('readonly', 'readonly');
                                $('#product_cost_txt').attr('readonly', 'readonly');
                                $('#product_buydown_txt').attr('readonly', 'readonly');

                                $('#product_crv_txt').val(""); //does not matter what is the value, we will override this to empty
                                $('#product_cost_txt').val(""); //does not matter what is the value, we will override this to empty
                                $('#product_buydown_txt').val(""); //does not matter what is the value, we will override this to empty   

                                $('#_compute_cost_lbl').text(sp_json_helper.compute_amount(cur_sp,'cost'));
                                $('#_compute_crv_lbl').text(sp_json_helper.compute_amount(cur_sp,'crv'));
                                $('#_compute_buydown_lbl').text(sp_json_helper.compute_amount(cur_sp,'buydown'));
                            }else{
                                $('#_compute_cost_lbl').hide();
                                $('#_compute_crv_lbl').hide();
                                $('#_compute_buydown_lbl').hide();
                            }
                        }else{
                            if(sp_duplicate){
                                $('#product_name_txt').val(sp_duplicate.name);
                                $('#product_price_txt').val(sp_duplicate.price);
                                $('#product_value_customer_price_txt').val(sp_duplicate.value_customer_price);                             
                                $('#product_crv_txt').val(sp_duplicate.crv);
                                $('#product_taxable_check').prop('checked', sp_duplicate.is_taxable);
                                $('#product_sale_report_check').prop('checked', sp_duplicate.is_sale_report);
                                $('#product_type_txt').val(sp_duplicate.p_type);
                                $('#product_tag_txt').val(sp_duplicate.p_tag);     
                                $('#product_cost_txt').val(sp_duplicate.cost);     
                                $('#product_vendor_txt').val(sp_duplicate.vendor);   
                                $('#product_buydown_txt').val(sp_duplicate.buydown);                                
                            }else{
                                var is_taxable_prefill = null;
                                if(suggest_product){
                                    is_taxable_prefill = product_json_helper.get_suggest_info('is_taxable',suggest_product);
                                }else{
                                    is_taxable_prefill = false;
                                }

                                $('#product_taxable_check').prop('checked', is_taxable_prefill);
                                $('#product_sale_report_check').prop('checked', true);                                     
                            }
                    
                        }

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

                        if(is_product_exist){
                            display_group_data(cur_sp);
                            display_kit_data(cur_sp);
                        }

                        //auto complete for product type and tag
                        if(is_get_lookup_type_tag_online){
                            var get_lookup_type_tag_b = ajax_helper.exe.bind(ajax_helper.exe,'product/get_lookup_type_tag','GET','get type/tag data ...',null/*data*/);
                            async.waterfall([get_lookup_type_tag_b],function(error,result){
                                if(error){
                                    error_lib.alert_error(error);
                                }else{
                                    lookup_type_tag = result;
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
        ,MANAGE_GROUP_BUTTON_PRESS : MANAGE_GROUP_BUTTON_PRESS
        ,MANAGE_KIT_BUTTON_PRESS : MANAGE_KIT_BUTTON_PRESS
        ,DUPLICATE_BUTTON_PRESS : DUPLICATE_BUTTON_PRESS
        ,show_prompt : show_prompt
    }
});