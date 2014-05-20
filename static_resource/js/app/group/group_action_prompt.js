define(
    [
         'lib/async'
        ,'app/group/group_action_validator'
    ]
    ,function
    (
         async
        ,group_action_validator
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
            alert('specify action to perform');
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
                '<label for="group_action_price_txt">Price:</label>' +
                '<input type="text" id = "group_action_price_txt">' +
                '<br>' +
                '<label for="group_action_crv_txt">Crv:</label>' +
                '<input type="text" id = "group_action_crv_txt">' +
                '<br>' +
                '<label for="group_action_is_taxable_txt">Taxable:</label>' +
                '<input type="text" id = "group_action_is_taxable_txt">' +
                '<label>type "true" or "false"</label>' +
                '<br>' +
                '<label for="group_action_is_sale_report_txt">Sale report:</label>' +
                '<input type="text" id = "group_action_is_sale_report_txt">' +
                '<label>type "true" or "false"</label>' +
                '<br>' +
                '<label for="group_action_p_type_txt">Type:</label>' +
                '<input type="text" id = "group_action_p_type_txt">' +
                '<br>' +
                '<label for="group_action_p_tag_txt">Tag:</label>' +
                '<input type="text" id = "group_action_p_tag_txt">' +
                '<br>' +
                '<label for="group_action_vendor_txt">Vendor:</label>' +
                '<input type="text" id = "group_action_vendor_txt">' +
                '<br>' + 
                '<label for="group_action_cost_txt">Cost:</label>' +
                '<input type="text" id = "group_action_cost_txt">' +
                '<br>' +      
                '<label for="group_action_buydown_txt">Buydown:</label>' +
                '<input type="text" id = "group_action_buydown_txt">' +
                '<br>' +          
        '</div>' ;


        var ok_btn_handler_b = ok_btn_handler.bind(ok_btn_handler,callback);
        var cancel_btn_handler_b = cancel_btn_handler.bind(cancel_btn_handler,callback);
        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'perform group action',
                zIndex: 10000,
                autoOpen: true,
                width: 600,
                height: 600,
                buttons: [ { text: "Ok", click: ok_btn_handler_b },{ text: "Cancel", click: cancel_btn_handler_b } ],
                open: function( event, ui ) 
                {
                    var tax_rate = localStorage.getItem('tax_rate');
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