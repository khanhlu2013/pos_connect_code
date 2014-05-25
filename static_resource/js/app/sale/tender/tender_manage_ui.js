define(
[
     'lib/async'
    ,'lib/error_lib'
    ,'lib/ui/ui'
    ,'lib/number/number'
]
,function
(
     async
    ,error_lib
    ,ui
    ,number
)
{
    var PT_LST = null;
    var DUE_AMOUNT = null;

    var ERROR_CANCEL_tender_cancel_button_press = 'ERROR_CANCEL_tender_cancel_button_press';
    var CASH_PT_ID = 'CASH_PT_ID';//a generate id for cash pt. which is a system defined pt
    var TENDER_OK_BTN_ID = 'TENDER_OK_BTN_ID'// a generate id for ok button to make it easier to modify the attribute of this ui
    var TENDER_MSG_LABEL_ID = '_tender_manage_msg_lbl';
    
    function get_total_tender(lst){
        /*
            lst is a list of object retuning from tender_manage_ui.exe
        */
        var result = 0.0;

        for(var i = 0;i<lst.length;i++){
            result += lst.amount;
        }
        return result;
    }

    function get_pt_id(id){
        return '_payment_type_input_' + id; 
    }

    function refresh_ui_validation(result_dic){
        var temp_amount = 0.0;

        for(var pt_id in result_dic) {
            var amount_str = result_dic[pt_id].amount_str;
            if(amount_str.length != 0){
                if(!number.is_positive_double(amount_str)){
                    temp_amount = NaN;
                    $('#' + get_pt_id(pt_id)).addClass('error');
                }else{
                    temp_amount += parseFloat(amount_str);
                    $('#' + get_pt_id(pt_id)).removeClass('error');
                }
            }else{
                $('#' + get_pt_id(pt_id)).removeClass('error');
            }
        }        

        if(temp_amount >= DUE_AMOUNT){
            $('#' + TENDER_OK_BTN_ID).text('Change: ' + number.round_2_decimal(temp_amount - DUE_AMOUNT));
            $('#' + TENDER_OK_BTN_ID).show();
            $('#' + TENDER_MSG_LABEL_ID).text("");
        }else{
            $('#' + TENDER_OK_BTN_ID).hide();
            if(!isNaN(temp_amount)){
                var toPay = number.round_2_decimal(DUE_AMOUNT - temp_amount);
                $('#' + TENDER_MSG_LABEL_ID).text('to pay: ' + toPay);
            }else{
                $('#' + TENDER_MSG_LABEL_ID).text("");
            }
        }
    }

    function get_lst_result_from_ui(){
        /*
            PRE: the ui contain valid input: either empty string for amount fields, or valid positive double
        */
        var lst_result = [];
        var dic_result = get_dic_result_from_ui();

        for(var key in dic_result){
            var amount_str = dic_result[key].amount_str;
            var pt = dic_result[key].payment_type;

            if(amount_str.length !=0){
                var amount = parseFloat(amount_str);
                var name = (pt.id == CASH_PT_ID ? null : pt.name)
                var obj = {name:name,amount:amount};
                lst_result.push(obj);
            }
        }
        return lst_result;        
    }

    function get_dic_result_from_ui(){
        /*
            return a dictonary: key = id of Payment_type, value = object(String: amount_str,Payment_type:pt)
            a dictionary is easier to link between html ui element and Payment_type so we can manipuate ui easier
        */
        var result_dic = {};
        for(var i = 0;i<PT_LST.length;i++){
            var pt = PT_LST[i];
            var amount_str = $('#' + get_pt_id(pt.id)).val().trim();

            result_dic[pt.id] = {amount_str:amount_str,payment_type:pt}
        } 
        return result_dic;        
    }

    function ui_response(){
        var result_dic = get_dic_result_from_ui();
        refresh_ui_validation(result_dic)
    }

    function exe(payment_type_lst,due_amount,callback){
        /*
            return a list of objects, each obj containing 2 fields: name(string;if null it is 'cash') and amount(float)
        */
        PT_LST = new Array();
        for(var i = 0;i<payment_type_lst.length;i++){
            PT_LST.push(payment_type_lst[i]);
        }
        var cash_pt = {id:CASH_PT_ID,name:'cash'};//mandatory cash payment type
        PT_LST.unshift(cash_pt)
        
        DUE_AMOUNT = due_amount;

        var input_html = '';
        for(var i = 0;i<PT_LST.length;i++){
            var pt = PT_LST[i];
            input_html += ('<label for=' + '"' + get_pt_id(pt.id) + '"' + '>' + pt.name + '</label>');
            input_html += ('<input id =' + '"' + get_pt_id(pt.id) + '"' + '>');
            input_html += ('<br/>');
        }

        var html_str = 
            '<div id="tender_manage_dlg">' +
                input_html +
                '<br/>'+
                '<label id=' + '"' + TENDER_MSG_LABEL_ID + '"' + '></label>'
            '</div>';

        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'due: ' + due_amount,
                zIndex: 10000,
                autoOpen: true,
                width: 500,
                height: 400,
                buttons : 
                [
                    {
                        text:'ok',
                        click:function(){
                            var result = get_lst_result_from_ui();//pre condition:(ui contain valid input) is satisfy. If ui does not contain valid input, this button is disable and can't be clicked to invoke this method
                            $('#tender_manage_dlg').dialog('close');
                            callback(null,result);
                        }
                    },                
                    {
                        text:'cancel',
                        click: function(){
                            $('#tender_manage_dlg').dialog('close');
                            callback(ERROR_CANCEL_tender_cancel_button_press);
                        }
                    }
                ],
                open: function( event, ui ) 
                {
                    $('.ui-dialog-buttonpane button:contains(ok)').attr("id", TENDER_OK_BTN_ID);//assign an id to this button

                    for(var i = 0;i<PT_LST.length;i++){
                        var pt = PT_LST[i];
                        
                        $('#' + get_pt_id(pt.id)).keyup(function(event){
                            ui_response();
                        });
                    }
                    ui_response();
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });  
    }

    return{
         exe:exe
        ,get_total_tender:get_total_tender 
        ,ERROR_CANCEL_tender_cancel_button_press:ERROR_CANCEL_tender_cancel_button_press
    }
});