define(
    [
         'lib/async'
        ,'app/group/group_validator'
        ,'app/store_product/sp_online_name_search_ui'
        ,'lib/error_lib'
        ,'app/product/product_json_helper'
        ,'lib/ui/confirm'
    ]
    ,function
    (
         async
        ,group_validator
        ,sp_online_name_search_ui
        ,error_lib
        ,product_json_helper
        ,confirm
    )
{
    var ERROR_CANCEL_GROUP_PROMPT = 'ERROR_CANCEL_GROUP_PROMPT';
    var group_child_tbl = document.getElementById('group_child_tbl');
    var GROUP_CHILD_SP_LST = [];


    function cancel_btn_handler(callback){
        $("#group_prompt_dlg").dialog("close");
        callback(ERROR_CANCEL_GROUP_PROMPT/*error*/);
    }

    function ok_btn_handler(callback){
        var result = get_result_from_ui();
        var error_lst = group_validator.validate(result);
        if(error_lst.length==0){
            $("#group_prompt_dlg").dialog("close");
            callback(null/*error*/,result);    
        }else{
            set_validation_indicator(error_lst);
        }
    }


    function add_group_child_handler(){
        async.waterfall([sp_online_name_search_ui.exe],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            var sp = result;
            if(product_json_helper.get_sp_from_sp_lst(sp.product_id,GROUP_CHILD_SP_LST) == null){
                GROUP_CHILD_SP_LST.push(sp);
                populate_group_child_tbl();
            }else{
                alert('product is already in list');
            }
        });
    }

    function set_validation_indicator(error_lst){
        $('#group_name_txt').removeClass("error");  
        $("label[for='group_child_tbl']").removeClass("error");
        $("label[for='group_child_tbl']").text("items");

        if(error_lst.indexOf(group_validator.ERROR_GROUP_VALIDATION_NAME) != -1){
            $('#group_name_txt').addClass("error");  
        }
    }

    function display_dialog(callback){
        var title = 'group';
        var ok_btn_handler_b = ok_btn_handler.bind(ok_btn_handler,callback);
        var cancel_btn_handler_b = cancel_btn_handler.bind(cancel_btn_handler,callback);

        $('#group_prompt_dlg').keypress(function(e) {
            if (e.keyCode == $.ui.keyCode.ENTER) {
                ok_btn_handler(callback);
            }
        });
        
        $('#group_prompt_dlg').dialog({
             title:title
            ,buttons: [ { text: "Ok", click: ok_btn_handler_b },{ text: "Cancel", click: cancel_btn_handler_b } ]
            ,modal : true
            ,width : 600
            ,heigh : 400
        });
        $('#group_prompt_dlg').dialog('open');        
    }

    function get_result_from_ui(){
        var name = $('#group_name_txt').val();
        
        var result = {
             name                   : name
            ,group_child_sp_lst     : GROUP_CHILD_SP_LST
        }

        return result;
    }
    
    function remove_child(index){
        confirm.exe(
            'remove item?'
            ,function(){
                GROUP_CHILD_SP_LST.splice(index, 1);
                populate_group_child_tbl();                
            }
            ,function(){

            }
        );
    }

    function populate_group_child_tbl(){
        group_child_tbl.innerHTML = "";
        var tr;var td;

        //columns
        tr = group_child_tbl.insertRow(-1);
        var columns = ['name','reg price','crv','is_taxable','remove']
        for(var i = 0;i<columns.length;i++){
            td = tr.insertCell(-1);
            td.innerHTML = columns[i];
        }
        
        for(var i = 0;i<GROUP_CHILD_SP_LST.length;i++){
            tr = group_child_tbl.insertRow(-1);
            var cur_group_child = GROUP_CHILD_SP_LST[i];

            //name
            td = tr.insertCell(-1);
            td.innerHTML = cur_group_child.name;

            //regular price
            td = tr.insertCell(-1);
            td.innerHTML = cur_group_child.price;

            //crv
            td = tr.insertCell(-1);
            td.innerHTML = cur_group_child.crv;  

            //is_taxable
            td = tr.insertCell(-1);
            td.innerHTML = cur_group_child.is_taxable;           

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

    function exe (name ,group_child_sp_lst ,callback ){
        $('#group_add_child_btn').off('click').click(add_group_child_handler);
        $('#group_name_txt').val(name);
        GROUP_CHILD_SP_LST = group_child_sp_lst;            
        populate_group_child_tbl();

        set_validation_indicator([]);

        display_dialog(callback);
    }

    return{
         ERROR_CANCEL_GROUP_PROMPT : ERROR_CANCEL_GROUP_PROMPT
        ,exe:exe
    }
});