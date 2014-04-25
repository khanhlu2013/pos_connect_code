define(
    [
         'lib/async'
        ,'app/mix_match/mix_match_validator'
        ,'app/store_product/sp_online_name_search_ui'
        ,'lib/error_lib'
        ,'app/product/product_json_helper'
        ,'app/mix_match/mix_match_util'
    ]
    ,function
    (
         async
        ,mix_match_validator
        ,sp_online_name_search_ui
        ,error_lib
        ,product_json_helper
        ,mm_util
    )
{
    var ERROR_CANCEL_MIX_MATCH_PROMPT = 'ERROR_CANCEL_MIX_MATCH_PROMPT';
    var mix_match_child_tbl = document.getElementById('mix_match_child_tbl');
    var MIX_MATCH_CHILD_SP_LST = [];
    var TAX_RATE = null;

    function ui_response(){
        var result = get_result_from_ui();  
        var error_lst = mix_match_validator.validate(result);
        set_validation_indicator(error_lst);              
        price = mm_util.calculate_total_price(result);
        $('#mix_match_total_price_txt').val(price);          
    }

    function cancel_btn_handler(callback){
        $("#mix_match_prompt_dlg").dialog("close");
        callback(ERROR_CANCEL_MIX_MATCH_PROMPT/*error*/);
    }

    function ok_btn_handler(callback){
        var result = get_result_from_ui();
        var error_lst = mix_match_validator.validate(result);
        if(error_lst.length==0){
            $("#mix_match_prompt_dlg").dialog("close");
            callback(null/*error*/,result);    
        }else{
            set_validation_indicator(error_lst);
            price = mm_util.calculate_total_price(result);
            $('#mix_match_total_price_txt').val(price);               
        }
    }

    function init_ui_functionality(callback){
        $('#mix_match_add_child_btn').off('click').click(add_mix_match_child_handler);
        
        $('#mix_match_qty_txt').keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                ui_response();
            }
        });
        $('#mix_match_unit_discount_txt').keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                ui_response();
            }
        });        
    }

    function add_mix_match_child_handler(){
        async.waterfall([sp_online_name_search_ui.exe],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            var sp = result;
            if(product_json_helper.get_sp_from_sp_lst(sp.product_id,MIX_MATCH_CHILD_SP_LST) == null){
                MIX_MATCH_CHILD_SP_LST.push(sp);
                populate_mix_match_child_tbl();
                ui_response();
            }else{
                alert('product is already in list');
            }
        });
    }

    function set_validation_indicator(error_lst){
        $('#mix_match_name_txt').removeClass("error");  
        $('#mix_match_qty_txt').removeClass("error");  
        $('#mix_match_unit_discount_txt').removeClass("error");  
        $("label[for='mix_match_child_tbl']").removeClass("error");
        $("label[for='mix_match_child_tbl']").text("items");

        if(error_lst.indexOf(mix_match_validator.ERROR_MIX_MATCH_VALIDATION_NAME) != -1){
            $('#mix_match_name_txt').addClass("error");  
        }
        if(error_lst.indexOf(mix_match_validator.ERROR_MIX_MATCH_VALIDATION_QTY) != -1){
            $('#mix_match_qty_txt').addClass("error");  
        }
        if(error_lst.indexOf(mix_match_validator.ERROR_MIX_MATCH_VALIDATION_UNIT_DISCOUNT) != -1){
            $('#mix_match_unit_discount_txt').addClass("error");  
        }
        if(error_lst.indexOf(mix_match_validator.ERROR_MIX_MATCH_VALIDATION_CHILD_EMPTY) != -1){
            $("label[for='mix_match_child_tbl']").addClass("error");  
            $("label[for='mix_match_child_tbl']").text("items is emtpy");
        }
        if(error_lst.indexOf(mix_match_validator.ERROR_MIX_MATCH_VALIDATION_CHILD_UNIFORM) != -1){
            $("label[for='mix_match_child_tbl']").addClass("error");  
            $("label[for='mix_match_child_tbl']").text("items must have same price,crv,taxable");
        }        
    }

    function display_dialog(callback){
        var title = 'mix match';
        var ok_btn_handler_b = ok_btn_handler.bind(ok_btn_handler,callback);
        var cancel_btn_handler_b = cancel_btn_handler.bind(cancel_btn_handler,callback);

        $('#mix_match_prompt_dlg').dialog({
             title:title
            ,buttons: [ { text: "Ok", click: ok_btn_handler_b },{ text: "Cancel", click: cancel_btn_handler_b } ]
            ,modal : true
            ,width : 600
            ,heigh : 400
        });
        $('#mix_match_prompt_dlg').dialog('open');        
    }

    function get_result_from_ui(){
        var name = $('#mix_match_name_txt').val();
        var qty = $('#mix_match_qty_txt').val();       
        var unit_discount = $('#mix_match_unit_discount_txt').val();
        
        var result = {
             name                       : name
            ,qty                        : qty     
            ,unit_discount              : unit_discount
            ,mix_match_child_sp_lst     : MIX_MATCH_CHILD_SP_LST
        }

        return result;
    }
    
    function remove_child(index){
        if(!confirm('remove item?')){
            return;
        }

        MIX_MATCH_CHILD_SP_LST.splice(index, 1);
        populate_mix_match_child_tbl();
        ui_response();
    }

    function populate_mix_match_child_tbl(){
        mix_match_child_tbl.innerHTML = "";
        var tr;var td;

        //columns
        tr = mix_match_child_tbl.insertRow(-1);
        var columns = ['name','reg price','crv','is_taxable','remove']
        for(var i = 0;i<columns.length;i++){
            td = tr.insertCell(-1);
            td.innerHTML = columns[i];
        }
        
        for(var i = 0;i<MIX_MATCH_CHILD_SP_LST.length;i++){
            tr = mix_match_child_tbl.insertRow(-1);
            var cur_mix_match_child = MIX_MATCH_CHILD_SP_LST[i];

            //name
            td = tr.insertCell(-1);
            td.innerHTML = cur_mix_match_child.name;

            //regular price
            td = tr.insertCell(-1);
            td.innerHTML = cur_mix_match_child.price;

            //crv
            td = tr.insertCell(-1);
            td.innerHTML = cur_mix_match_child.crv;  

            //is_taxable
            td = tr.insertCell(-1);
            td.innerHTML = cur_mix_match_child.is_taxable;           

            //edit
            td = tr.insertCell(-1);
            td.innerHTML = 'remove';
            (function(index){
                td.addEventListener('click',function(){
                    remove_child(index);
                });
            })(i)                         
        }
    }

    function exe (name ,qty ,unit_discount ,mix_match_child_sp_lst ,tax_rate,callback ){
        TAX_RATE = tax_rate;
        init_ui_functionality(callback);

        var is_create = (name == null && qty == null && unit_discount == null && ( mix_match_child_sp_lst == null || mix_match_child_sp_lst.length == 0))
        if(!is_create){
            $('#mix_match_name_txt').val(name);
            $('#mix_match_qty_txt').val(qty);
            $('#mix_match_unit_discount_txt').val(unit_discount);
            MIX_MATCH_CHILD_SP_LST = mix_match_child_sp_lst;            
            populate_mix_match_child_tbl();

            result = get_result_from_ui();
            var error_lst = mix_match_validator.validate(result);
            set_validation_indicator(error_lst);
            price = mm_util.calculate_total_price(result);
            $('#mix_match_total_price_txt').val(price);  
        }

        display_dialog(callback);
    }

    return{
         ERROR_CANCEL_MIX_MATCH_PROMPT : ERROR_CANCEL_MIX_MATCH_PROMPT
        ,exe:exe
    }

});