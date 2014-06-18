define(
    [
         'lib/async'
        ,'app/group/group_action_validator'
        ,'lib/ui/button'
        ,'lib/ui/ui'
    ]
    ,function
    (
         async
        ,group_action_validator
        ,ui_button
        ,ui
    )
{
    var ERROR_CANCEL_GROUP_ACTION_PROMPT = 'ERROR_CANCEL_GROUP_ACTION_PROMPT';

    function set_validation_indicator(error_lst){
 
        $('#group_action_price_txt').removeClass("error"); 
        $('#group_action_crv_txt').removeClass("error"); 
        $('#group_action_is_taxable_txt').removeClass("error"); 
        $('#group_action_is_sale_report_txt').removeClass("error"); 
        $('#group_action_p_type_txt').removeClass("error"); 
        $('#group_action_p_tag_txt').removeClass("error"); 
        $('#group_action_vendor_txt').removeClass("error"); 
        $('#group_action_cost_txt').removeClass("error"); 
        $('#group_action_buydown_txt').removeClass("error");   

        if(error_lst.indexOf(group_action_validator.ERROR_GROUP_ACTION_VALIDATION_EMPTY_ACTION) != -1){
            ui.ui_alert('specify action to perform');
        }
        if(error_lst.indexOf(group_action_validator.ERROR_GROUP_ACTION_VALIDATION_PRICE) != -1){
            $('#group_action_price_txt').addClass("error");  
        }
        if(error_lst.indexOf(group_action_validator.ERROR_GROUP_ACTION_VALIDATION_CRV) != -1){
            $('#group_action_crv_txt').addClass("error");  
        }        
        if(error_lst.indexOf(group_action_validator.ERROR_GROUP_ACTION_VALIDATION_IS_TAXABLE) != -1){
            $('#group_action_is_taxable_txt').addClass("error");  
        }          
        if(error_lst.indexOf(group_action_validator.ERROR_GROUP_ACTION_VALIDATION_IS_SALE_REPORT) != -1){
            $('#group_action_is_sale_report_txt').addClass("error");  
        }
        if(error_lst.indexOf(group_action_validator.ERROR_GROUP_ACTION_VALIDATION_P_TYPE) != -1){
            $('#group_action_p_type_txt').addClass("error");  
        }        
        if(error_lst.indexOf(group_action_validator.ERROR_GROUP_ACTION_VALIDATION_P_TAG) != -1){
            $('#group_action_p_tag_txt').addClass("error");  
        }          
        if(error_lst.indexOf(group_action_validator.ERROR_GROUP_ACTION_VALIDATION_VENDOR) != -1){
            $('#group_action_vendor_txt').addClass("error");  
        }          
        if(error_lst.indexOf(group_action_validator.ERROR_GROUP_ACTION_VALIDATION_COST) != -1){
            $('#group_action_cost_txt').addClass("error");  
        }          
        if(error_lst.indexOf(group_action_validator.ERROR_GROUP_ACTION_VALIDATION_BUYDOWN) != -1){
            $('#group_action_buydown_txt').addClass("error");  
        }                
    }

    function get_result_from_ui(){
        var result = 
        {
             price           : $('#group_action_price_txt').val()
            ,crv             : $('#group_action_crv_txt').val()
            ,is_taxable      : $('#group_action_is_taxable_txt').val()
            ,is_sale_report  : $('#group_action_is_sale_report_txt').val()
            ,p_type          : $('#group_action_p_type_txt').val()
            ,p_tag           : $('#group_action_p_tag_txt').val()
            ,vendor          : $('#group_action_vendor_txt').val()
            ,cost            : $('#group_action_cost_txt').val()
            ,buydown         : $('#group_action_buydown_txt').val()          
        };  
        return result;
    }

    function cancel_btn_handler(callback){
        $("#group_action_prompt_dialog").dialog("close");
        callback(ERROR_CANCEL_GROUP_ACTION_PROMPT);
    }

    function ok_btn_handler(callback){
        var result = get_result_from_ui();
        var error_lst = group_action_validator.validate(result);
        if(error_lst.length==0){
            $("#group_action_prompt_dialog").dialog("close");
            callback(null/*error*/,result);    
        }else{
            set_validation_indicator(error_lst);
        }
    }

    function exe (callback ){

        var html_str = 
            '<div id="group_action_prompt_dialog">' +
                '<div class="form-horizontal">' +
                    '<div class="form-group">' +
                        '<label for="group_action_price_txt" class="col-sm-4 control-label" >price:</label>' +
                        '<div class="col-sm-8">' +
                            '<input type="text" id = "group_action_price_txt">' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="group_action_crv_txt" class="col-sm-4 control-label">crv:</label>' +
                        '<div class="col-sm-8">' +
                            '<input type="text" id = "group_action_crv_txt">' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="group_action_is_taxable_txt" class="col-sm-4 control-label" >taxable:</label>' +
                        '<div class="col-sm-8">' +
                            '<input type="text" id = "group_action_is_taxable_txt">' +
                            '<label>type "true" or "false"</label>' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="group_action_is_sale_report_txt" class="col-sm-4 control-label">sale report:</label>' +
                        '<div class="col-sm-8">' +
                            '<input type="text" id = "group_action_is_sale_report_txt">' +
                            '<label>type "true" or "false"</label>' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="group_action_p_type_txt" class="col-sm-4 control-label" >type:</label>' +
                        '<div class="col-sm-8">' +
                            '<input type="text" id = "group_action_p_type_txt">' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="group_action_p_tag_txt" class="col-sm-4 control-label">tag:</label>' +
                        '<div class="col-sm-8">' +
                            '<input type="text" id = "group_action_p_tag_txt">' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="group_action_vendor_txt" class="col-sm-4 control-label" >vendor:</label>' +
                        '<div class="col-sm-8">' +
                            '<input type="text" id = "group_action_vendor_txt">' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="group_action_cost_txt" class="col-sm-4 control-label">cost:</label>' +
                        '<div class="col-sm-8">' +
                            '<input type="text" id = "group_action_cost_txt">' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="group_action_buydown_txt" class="col-sm-4 control-label">buydown:</label>' +
                        '<div class="col-sm-8">' +
                            '<input type="text" id = "group_action_buydown_txt">' +
                        '</div>' +
                    '</div>' +

                '</div>'+
            '</div>' 
        ;


        var ok_btn_handler_b = ok_btn_handler.bind(ok_btn_handler,callback);
        var cancel_btn_handler_b = cancel_btn_handler.bind(cancel_btn_handler,callback);
        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'perform group action',
                zIndex: 10000,
                autoOpen: true,
                width: 650,
                // height: 500,
                buttons: { 
                    ok_btn: { id: '_group_perform_action_ok_btn', click: ok_btn_handler_b },
                    cancel_btn: { id: '_group_perform_action_cancel_btn', click: cancel_btn_handler_b } 
                },
                open: function( event, ui ) 
                {
                    ui_button.set_css('_group_perform_action_ok_btn','green','ok',true);
                    ui_button.set_css('_group_perform_action_cancel_btn','orange','remove',true);
                    var tax_rate = parseFloat(localStorage.getItem('tax_rate'));
                    $('#tax_rate_txt').val(tax_rate);
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });  
    }

    return{
         ERROR_CANCEL_GROUP_ACTION_PROMPT : ERROR_CANCEL_GROUP_ACTION_PROMPT
        ,exe:exe
    }
});