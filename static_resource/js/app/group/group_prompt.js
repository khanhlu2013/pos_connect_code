define(
    [
         'lib/async'
        ,'app/group/group_validator'
        ,'app/store_product/sp_search_ui'
        ,'lib/error_lib'
        ,'app/product/product_json_helper'
        ,'lib/ui/ui'
    ]
    ,function
    (
         async
        ,group_validator
        ,sp_search_ui
        ,error_lib
        ,product_json_helper
        ,ui
    )
{
    var ERROR_CANCEL_GROUP_PROMPT = 'ERROR_CANCEL_GROUP_PROMPT';
    var ERROR_REMOVE_GROUP_PROMPT = 'ERROR_REMOVE_GROUP_PROMPT';
    var group_sp_tbl = null;
    var GROUP_SP_LST = [];


    function cancel_btn_handler(callback){
        $("#group_prompt_dlg").dialog("close");
        callback(ERROR_CANCEL_GROUP_PROMPT/*error*/);
    }

    function remove_btn_handler(callback){
        $("#group_prompt_dlg").dialog("close");
        callback(ERROR_REMOVE_GROUP_PROMPT/*error*/);
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


    function add_group_sp_handler(){
        var search_b = sp_search_ui.exe.bind(sp_search_ui.exe,true/*multiple_selection*/);
        async.waterfall([search_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            var sp_lst = result;
            for(var i = 0;i<sp_lst.length;i++){
                if(product_json_helper.get_sp_from_sp_lst(sp_lst[i].product_id,GROUP_SP_LST) == null){
                    GROUP_SP_LST.push(sp_lst[i]);
                }                
            }
            populate_group_sp_tbl();
        });
    }

    function set_validation_indicator(error_lst){
        $('#group_name_txt').removeClass("error");  
        $("label[for='group_sp_tbl']").removeClass("error");
        $("label[for='group_sp_tbl']").text("items");

        if(error_lst.indexOf(group_validator.ERROR_GROUP_VALIDATION_NAME) != -1){
            $('#group_name_txt').addClass("error");  
        }
    }

    function get_result_from_ui(){
        var name = $('#group_name_txt').val();
        
        var result = {
             name                   : name
            ,group_sp_lst           : GROUP_SP_LST
        }

        return result;
    }
    
    function remove_child(index){
        ui.ui_confirm(
            'remove item?'
            ,function(){
                GROUP_SP_LST.splice(index, 1);
                populate_group_sp_tbl();                
            }
            ,function(){

            }
        );
    }

    function populate_group_sp_tbl(){
        group_sp_tbl.innerHTML = "";
        var tr;var td;

        //columns
        tr = group_sp_tbl.insertRow(-1);
        var columns = ['name','reg price','crv','is_taxable','remove']
        for(var i = 0;i<columns.length;i++){
            td = tr.insertCell(-1);
            td.innerHTML = columns[i];
        }
        
        for(var i = 0;i<GROUP_SP_LST.length;i++){
            tr = group_sp_tbl.insertRow(-1);
            var cur_group_sp = GROUP_SP_LST[i];

            //name
            td = tr.insertCell(-1);
            td.innerHTML = cur_group_sp.name;

            //regular price
            td = tr.insertCell(-1);
            td.innerHTML = cur_group_sp.price;

            //crv
            td = tr.insertCell(-1);
            td.innerHTML = cur_group_sp.crv;  

            //is_taxable
            td = tr.insertCell(-1);
            td.innerHTML = cur_group_sp.is_taxable;           

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

    function exe (name ,group_sp_lst,callback ){
        var html_str =
            '<div id="group_prompt_dlg">' +
                '<label for="group_name_txt">name:</label>' +
                '<input type="text" id = "group_name_txt">' +
                '<br>' +
                '<br>' +
                '<label for="group_sp_tbl"></label>' +
                '<input type="button" id = "group_add_child_btn" value="add">' +
                '<table id="group_sp_tbl" border="1"></table>' +
                '<br>' +
            '</div>';

        var ok_btn_handler_b = ok_btn_handler.bind(ok_btn_handler,callback);
        var remove_btn_handler_b = remove_btn_handler.bind(remove_btn_handler,callback);
        var cancel_btn_handler_b = cancel_btn_handler.bind(cancel_btn_handler,callback);

        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'group',
                zIndex: 10000,
                autoOpen: true,
                width: 700,
                height: 500,
                buttons : 
                [
                    {text:'ok', click:ok_btn_handler_b},
                    {text:'remove', click:remove_btn_handler_b},
                    {text:'cancel', click:cancel_btn_handler_b}

                ],
                open: function( event, ui ) 
                {
                    $('#group_add_child_btn').click(add_group_sp_handler);
                    $('#group_name_txt').val(name);
                    group_sp_tbl = document.getElementById('group_sp_tbl');
                    GROUP_SP_LST = group_sp_lst
                    populate_group_sp_tbl();

                    $('#group_prompt_dlg').keypress(function(e) {
                        if (e.keyCode == $.ui.keyCode.ENTER) {
                            ok_btn_handler(callback);
                        }
                    });
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });  
    }

    return{
         ERROR_CANCEL_GROUP_PROMPT : ERROR_CANCEL_GROUP_PROMPT
        ,ERROR_REMOVE_GROUP_PROMPT : ERROR_REMOVE_GROUP_PROMPT
        ,exe:exe
    }
});