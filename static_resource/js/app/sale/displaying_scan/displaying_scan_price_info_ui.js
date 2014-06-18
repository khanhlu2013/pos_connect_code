define(
[
     'lib/error_lib'
    ,'lib/async'
    ,'lib/ajax_helper'
    ,'lib/ui/ui'
    ,'lib/number/number'
    ,'lib/ui/button'
]
,function
(
     error_lib
    ,async
    ,ajax_helper
    ,ui
    ,number
    ,ui_button
)
{
    function exe(displaying_scan,tax_rate,callback){

        //MIX MATCH DISCOUNT
        var mm_discount_html = '';
        if(displaying_scan.mm_deal_info){
            mm_discount_html =
            '<div class="form-group">' +
                '<label for="_ds_price_info_dlg__mm_discount_txt" class="col-sm-5 control-label"> discount ' + displaying_scan.mm_deal_info.deal.name + ':</label>' +
                '<div class="col-sm-7">' +
                    '<input type="text" id = "_ds_price_info_dlg__mm_discount_txt" readonly>' +
                '</div>' +
            '</div>';            
        }
         
        //BUYDOWN
        var buydown_html = '';
        var buydown = displaying_scan.get_buydown();
        if(buydown){
            buydown_html = 
            '<div class="form-group">' +
                '<label for="_ds_price_info_dlg__buydown_txt" class="col-sm-5 control-label">buydown:</label>' +
                '<div class="col-sm-7">' +
                    '<input type="text" id = "_ds_price_info_dlg__buydown_txt" readonly>' +
                '</div>' +
            '</div>';
        }

        //BUYDOWN TAX
        var buydown_tax_html = '';
        var buydown_tax = displaying_scan.get_buydown_tax(tax_rate);
        if(buydown_tax){
            buydown_tax_html = 
            '<div class="form-group">' +
                '<label for="_ds_price_info_dlg__buydown_tax_txt" class="col-sm-5 control-label">buydown tax:</label>' +
                '<div class="col-sm-7">' +
                    '<input type="text" id = "_ds_price_info_dlg__buydown_tax_txt" readonly>' +
                '</div>' +
            '</div>';
        }        

        var html_str = 
            '<div id="_ds_price_info_dlg">' +
                '<div class="form-horizontal">' +
                    '<div class="form-group">' +
                        '<label for="_ds_price_info_dlg__reg_price_txt" class="col-sm-5 control-label">regular price:</label>' +
                        '<div class="col-sm-7">' +
                            '<input type="text" id = "_ds_price_info_dlg__reg_price_txt" readonly>' +
                        '</div>' +
                    '</div>' +
                    
                    mm_discount_html +

                    '<div class="form-group">' +
                        '<label for="_ds_price_info_dlg__crv_txt" class="col-sm-5 control-label">crv:</label>' +
                        '<div class="col-sm-7">' +
                            '<input type="text" id = "_ds_price_info_dlg__crv_txt" readonly>' +
                        '</div>' +
                    '</div>' +

                    buydown_html +
                    buydown_tax_html +

                    '<div class="form-group">' +
                        '<label for="_ds_price_info_dlg__tax_txt" class="col-sm-5 control-label">tax:</label>' +
                        '<div class="col-sm-7">' +
                            '<input type="text" id = "_ds_price_info_dlg__tax_txt" readonly>' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="_ds_price_info_dlg__otd_txt" class="col-sm-5 control-label">out the door $:</label>' +
                        '<div class="col-sm-7">' +
                            '<input type="text" id = "_ds_price_info_dlg__otd_txt" readonly>' +
                        '</div>' +
                    '</div>' +                    

                    '<hr>' +

                    '<div class="form-group">' +
                        '<label for="_ds_price_info_dlg__one_time_price_txt" class="col-sm-5 control-label">one time price change:</label>' +
                        '<div class="col-sm-7">' +
                            '<input type="text" id = "_ds_price_info_dlg__one_time_price_txt">' +
                        '</div>' +
                    '</div>' +  
                '</div>' +
            '</div>'
        ;

        $(html_str).appendTo('body').dialog({
            modal: true,
            title : 'price info',
            zIndex: 10000,
            autoOpen: true,
            width : 600,
            buttons : 
            {
                ok_btn : 
                {
                    id:'_ds_price_info_dlg__ok_btn',
                    click:function(){
                        var new_price_str = $('#_ds_price_info_dlg__one_time_price_txt').val().trim();
                        if(number.is_positive_double(new_price_str)){
                            $("#_ds_price_info_dlg").dialog("close");
                            callback(null,number.str_2_float(new_price_str));
                        }else{
                            $('#_ds_price_info_dlg__one_time_price_txt').addClass('error');
                            return;
                        }   
                    }
                },
                cancel_btn:
                {
                    id: '_ds_price_info_dlg__cancel_btn',
                    click: function(){
                        $("#_ds_price_info_dlg").dialog("close");
                        callback(null);              
                    }
                }
            },
            open: function( event, ui ) 
            {
                ui_button.set_css('_ds_price_info_dlg__ok_btn','green','ok',true);
                ui_button.set_css('_ds_price_info_dlg__cancel_btn','orange','remove',true);

                //REG PRICE
                $('#_ds_price_info_dlg__reg_price_txt').val(displaying_scan.price);
                
                //MM DEAL
                if(displaying_scan.mm_deal_info){
                    $('#_ds_price_info_dlg__mm_discount_txt').val(displaying_scan.mm_deal_info.unit_discount);
                }
                
                //CRV
                $('#_ds_price_info_dlg__crv_txt').val(displaying_scan.get_crv());
                
                //BUYDOWN
                var buydown = displaying_scan.get_buydown();
                if(buydown){
                    $('#_ds_price_info_dlg__buydown_txt').val(buydown);
                }                

                //BUYDOWN TAX
                var buydown_tax = displaying_scan.get_buydown_tax(tax_rate);
                if(buydown_tax){
                    $('#_ds_price_info_dlg__buydown_tax_txt').val(buydown_tax);
                }                

                //TAX
                $('#_ds_price_info_dlg__tax_txt').val(displaying_scan.get_tax(tax_rate));

                //OUT THE DOOR PRICE
                $('#_ds_price_info_dlg__otd_txt').val(displaying_scan.get_otd_wt_price(tax_rate));

            },
            close: function (event, ui) {
                $(this).remove();
            }
        });  
    }

    return{
        exe:exe
    }
})