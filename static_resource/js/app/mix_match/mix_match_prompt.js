define(
    [
         'lib/async'
        ,'app/mix_match/mix_match_validator'
        ,'app/store_product/sp_search_ui'
        ,'lib/error_lib'
        ,'app/product/product_json_helper'
        ,'lib/ui/ui'
        ,'app/group/group_select_ui'
        ,'lib/ui/button'
    ]
    ,function
    (
         async
        ,mix_match_validator
        ,sp_search_ui
        ,error_lib
        ,product_json_helper
        ,ui
        ,group_select_ui
        ,ui_button
    )
{
    var ERROR_CANCEL_MIX_MATCH_PROMPT = 'ERROR_CANCEL_MIX_MATCH_PROMPT';
    var ERROR_DELETE_MIX_MATCH = 'ERROR_DELETE_MIX_MATCH';
    var mix_match_child_tbl = null;
    var MIX_MATCH_CHILD_SP_LST = [];
    var TAX_RATE = null;

    function ui_response(){
        var result = get_result_from_ui();  
        var error_lst = mix_match_validator.validate(result);
        set_validation_indicator(error_lst);              
    }

    function ok_btn_handler(callback){
        var result = get_result_from_ui();
        var error_lst = mix_match_validator.validate(result);
        if(error_lst.length==0){
            $("#mix_match_prompt_dlg").dialog("close");
            callback(null/*error*/,result);    
        }else{
            set_validation_indicator(error_lst);
        }
    }

    function add_sp_lst_to_ui(sp_lst){
        for(var i = 0;i<sp_lst.length;i++){
            var sp = sp_lst[i];
            if(product_json_helper.get_sp_from_sp_lst(sp.product_id,MIX_MATCH_CHILD_SP_LST) == null){
                MIX_MATCH_CHILD_SP_LST.push(sp);
            }                
        }
        populate_mix_match_child_tbl();
    }

    function add_mix_match_group_handler(){
        var group_select_b = group_select_ui.exe.bind(group_select_ui.exe,true/*single_selection*/,true/*empty group is not allow*/)
        async.waterfall([group_select_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            var sp_lst = [];
            var group_lst = result;
            for(var i = 0;i<group_lst.length;i++){
                var group = group_lst[i];
                for(var j = 0;j<group.store_product_set.length;j++){
                    sp_lst.push(group.store_product_set[j]);
                }
                
            }
            add_sp_lst_to_ui(sp_lst);
        });
    }

    function add_mix_match_child_handler(){
        var sp_search_ui_b = sp_search_ui.exe.bind(sp_search_ui.exe,true/*multiple_selection*/);
        async.waterfall([sp_search_ui_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            add_sp_lst_to_ui(result/*sp_lst*/);
        });
    }

    function set_validation_indicator(error_lst){
        $('#mix_match_name_txt').removeClass("error");  
        $('#mix_match_qty_txt').removeClass("error");  
        $('#mix_match_price_txt').removeClass("error");  
        $("label[for='mix_match_child_tbl']").removeClass("error");
        $("label[for='mix_match_child_tbl']").text("");

        if(error_lst.indexOf(mix_match_validator.ERROR_MIX_MATCH_VALIDATION_NAME) != -1){
            $('#mix_match_name_txt').addClass("error");  
        }
        if(error_lst.indexOf(mix_match_validator.ERROR_MIX_MATCH_VALIDATION_QTY) != -1){
            $('#mix_match_qty_txt').addClass("error");  
        }
        if(error_lst.indexOf(mix_match_validator.ERROR_MIX_MATCH_VALIDATION_MM_PRICE) != -1){
            $('#mix_match_price_txt').addClass("error");  
        }
        if(error_lst.indexOf(mix_match_validator.ERROR_MIX_MATCH_VALIDATION_CHILD_EMPTY) != -1){
            $("label[for='mix_match_child_tbl']").addClass("error");  
            $("label[for='mix_match_child_tbl']").text("items is emtpy");
        }
    
    }

    function get_result_from_ui(){
        var name = $('#mix_match_name_txt').val();
        var qty = $('#mix_match_qty_txt').val();       
        var mm_price = $('#mix_match_price_txt').val();
        var is_include_crv_tax = $('#mix_match_is_include_crv_tax_check').is(':checked')

        var result = {
             name                       : name
            ,qty                        : qty     
            ,mm_price                   : mm_price
            ,is_include_crv_tax         : is_include_crv_tax
            ,mix_match_child_sp_lst     : MIX_MATCH_CHILD_SP_LST
        }

        return result;
    }
    
    function remove_child(index){
        ui.ui_confirm(
            'remove item?'
            ,function(){
                MIX_MATCH_CHILD_SP_LST.splice(index, 1);
                populate_mix_match_child_tbl();
            }
            ,function(){

            }
        )
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

            //remove
            td = tr.insertCell(-1);
            td.innerHTML = '<span class="glyphicon glyphicon-trash"></span>';
            td.className = 'danger';
            (function(index){
                td.addEventListener('click',function(){
                    remove_child(index);
                });
            })(i)                         
        }
    }

    function exe (name ,qty ,mm_price,is_include_crv_tax ,mix_match_child_sp_lst ,tax_rate,callback ){
        TAX_RATE = tax_rate;        
        var html_str = 

            '<div id="mix_match_prompt_dlg">' +
                '<div class="form-horizontal">' +
                    '<div class="form-group">' +
                        '<label for="mix_match_name_txt" class="col-sm-4 control-label">name:</label>' +
                        '<div class="col-sm-8">' +
                            '<input type="text" id = "mix_match_name_txt">' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="mix_match_qty_txt" class="col-sm-4 control-label">qty:</label>' +
                        '<div class="col-sm-8">' +
                            '<input type="text" id = "mix_match_qty_txt">' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="mix_match_price_txt" class="col-sm-4 control-label">price:</label>' +
                        '<div class="col-sm-8">' +
                            '<input type="text" id = "mix_match_price_txt">' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="mix_match_is_include_crv_tax_check" class="col-sm-4 control-label">include crv&tax:</label>' +
                        '<div class="col-sm-8">' +
                            '<input type="checkbox" id = "mix_match_is_include_crv_tax_check">' +
                        '</div>' +
                    '</div>' +

                    '<label for="mix_match_child_tbl"></label>' +

                    '<button id="mix_match_add_child_btn" class="btn btn-primary table-side-by-side">' +
                        '<span class="glyphicon glyphicon-plus"> product</span>' +
                    '</button>' +
                    '<button id="mix_match_add_group_btn" class="btn btn-primary table-side-by-side">' +
                        '<span class="glyphicon glyphicon-plus"> group</span>' +
                    '</button>' +
                    '<table id="mix_match_child_tbl" class="table table-hover table-bordered table-condensed table-striped"></table>' +
                '</div>' +
            '</div>'
        ;

        var ok_btn_handler_b = ok_btn_handler.bind(ok_btn_handler,callback)
        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'mix match',
                zIndex: 10000,
                autoOpen: true,
                width : 600,
                buttons : 
                {
                    ok_btn : 
                    {
                        id:'_mm_prompt_ok_btn',
                        click:ok_btn_handler_b
                    },
                    delete_btn:
                    {
                        id:'_mm_prompt_delete_btn',
                        click:function(){
                            ui.ui_confirm(
                                'delete mix match deal?'
                                ,function(){
                                    $("#mix_match_prompt_dlg").dialog("close");
                                    callback(ERROR_DELETE_MIX_MATCH/*error*/);                   
                                }
                                ,function(){
                                    
                                }
                            )                            
                        }
                    },
                    cancel_btn:
                    {
                        id: '_mm_prompt_cancel_btn',
                        click: function(){
                            $("#mix_match_prompt_dlg").dialog("close");
                            callback(ERROR_CANCEL_MIX_MATCH_PROMPT/*error*/);                       
                        }
                    }
                },
                open: function( event, ui ) 
                {
                    ui_button.set_css('_mm_prompt_ok_btn','green','ok',true);
                    ui_button.set_css('_mm_prompt_delete_btn','red','trash',true);
                    ui_button.set_css('_mm_prompt_cancel_btn','orange','remove',true);
                    $('#_mm_prompt_delete_btn').prop('disabled',name == null);
                    mix_match_child_tbl = document.getElementById('mix_match_child_tbl');
                    $('#mix_match_prompt_dlg').keypress(function(e) {
                        if (e.keyCode == $.ui.keyCode.ENTER) {
                            ok_btn_handler(callback);
                        }
                    });

                    $('#mix_match_add_child_btn').click(add_mix_match_child_handler);
                    $('#mix_match_add_group_btn').click(add_mix_match_group_handler);

                    $('#mix_match_qty_txt').keypress(function(event){
                        var keycode = (event.keyCode ? event.keyCode : event.which);
                        if(keycode == '13'){
                            ui_response();
                        }
                    });
                    $('#mix_match_price_txt').keypress(function(event){
                        var keycode = (event.keyCode ? event.keyCode : event.which);
                        if(keycode == '13'){
                            ui_response();
                        }
                    });      

                    $('#mix_match_name_txt').val(name);
                    $('#mix_match_qty_txt').val(qty);
                    $('#mix_match_price_txt').val(mm_price);
                    $('#mix_match_is_include_crv_tax_check').prop('checked',is_include_crv_tax)
                    MIX_MATCH_CHILD_SP_LST = mix_match_child_sp_lst;            
                    populate_mix_match_child_tbl();
                    result = get_result_from_ui();
                    set_validation_indicator([]);

                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });  
    }

    return{
         ERROR_CANCEL_MIX_MATCH_PROMPT : ERROR_CANCEL_MIX_MATCH_PROMPT
        ,ERROR_DELETE_MIX_MATCH : ERROR_DELETE_MIX_MATCH
        ,exe:exe
    }

});