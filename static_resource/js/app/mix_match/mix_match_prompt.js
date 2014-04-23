define(
    [
         'lib/async'
        ,'app/mix_match/mix_match_validator'
        ,'app/store_product/sp_online_name_search_ui'
        ,'lib/error_lib'
    ]
    ,function
    (
         async
        ,mix_match_validator
        ,sp_online_name_search_ui
        ,error_lib
    )
{
        
    var ERROR_CANCEL_MIX_MATCH_PROMPT = 'ERROR_CANCEL_MIX_MATCH_PROMPT';
    var mix_match_child_tbl = document.getElementById('mix_match_child_tbl');
    var MIX_MATCH_CHILD_LST = null;

    function cancel_btn_handler(callback){
        $("#mix_match_prompt_dlg").dialog("close");
        callback(ERROR_CANCEL_MIX_MATCH_PROMPT/*error*/);
    }

    function get_result_from_ui(validate_ui){
        var result = {
             "name"                 : $('#mix_match_name_txt').val()
            ,"qty"                  : $('#mix_match_qty_txt').val()            
            ,"unit_discount"        : $('#mix_match_unit_discount_txt').val()
            ,"mix_match_child_lst"  : MIX_MATCH_CHILD_LST
        }

        var error_lst = mix_match_validator.validate(result['name'],result['qty'],result['unit_discount'],result['mix_match_child_lst']);
        if(error_lst.length!=0){
            set_validation_indicator(error_lst)
            return null;
        }else{
            return result;
        }
    }

    function ok_btn_handler(callback){
        var result = get_result_from_ui(true/*validate_ui*/);
        if(result!=null){
            $("#mix_match_prompt_dlg").dialog("close");
            callback(null/*error*/,result);              
        }
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
        
        for(var i = 0;i<MIX_MATCH_CHILD_LST.length;i++){
            tr = mix_match_child_tbl.insertRow(-1);
            var cur_mix_match_child = MIX_MATCH_CHILD_LST[i];

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
            td = tr.insertCell(-1)
            td.innerHTML = 'remove'                         
        }
    }

    function populate_ui(
         name
        ,qty
        ,unit_discount
    ){

        $('#mix_match_name_txt').val(name);
        $('#mix_match_qty_txt').val(qty);
        $('#mix_match_unit_discount_txt').val(unit_discount);
        populate_mix_match_child_tbl();
    }

    function refresh_total_price(){
        var result = get_result_from_ui(false/*validate_ui*/);
        if(result == null){
            var total_price = 
            $('#mix_match_total_price_txt').val(total_price);
        }
    }

    function add_mix_match_child_handler(){
        async.waterfall([sp_online_name_search_ui.exe],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            var sp = result;
            MIX_MATCH_CHILD_LST.push(sp);
            populate_mix_match_child_tbl();
        }); 
    }

    function exe
    (
         name
        ,qty
        ,unit_discount
        ,mix_match_child_lst
        ,callback
    ){
        //save child list to global var
        MIX_MATCH_CHILD_LST = mix_match_child_lst;

        //INIT UI FUNCTIONALITY
        $('#mix_match_add_child_btn').off('click').click(add_mix_match_child_handler);
        var ok_btn_handler_b = ok_btn_handler.bind(ok_btn_handler,callback);
        var cancel_btn_handler_b = cancel_btn_handler.bind(cancel_btn_handler,callback);
        
        $('#mix_match_qty_txt').keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                refresh_total_price();
            }
        });
        $('#mix_match_unit_discount_txt').keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                refresh_total_price();
            }
        });

        //init ui
        populate_ui(
             name
            ,qty
            ,unit_discount
        );
        set_validation_indicator([]);

        //display prompt
        var title = 'mix match'
        $('#mix_match_prompt_dlg').dialog({
             title:title
            ,buttons: [ { text: "Ok", click: ok_btn_handler_b },{ text: "Cancel", click: cancel_btn_handler_b } ]
            ,modal : true
            ,width : 600
            ,heigh : 400
        });
        $('#mix_match_prompt_dlg').dialog('open');
    }

    return{
         ERROR_CANCEL_MIX_MATCH_PROMPT : ERROR_CANCEL_MIX_MATCH_PROMPT
        ,exe:exe
    }
});