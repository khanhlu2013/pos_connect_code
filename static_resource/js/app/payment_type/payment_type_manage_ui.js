define(
[
     'lib/async'
    ,'lib/error_lib'
    ,'lib/ui/ui'
    ,'lib/ajax_helper'
    ,'app/payment_type/pt_delete'    
    ,'app/payment_type/pt_get'
    ,'app/payment_type/pt_update'  
    ,'app/payment_type/pt_insert'
    ,'app/payment_type/pt_prompt'
]
,function
(
     async
    ,error_lib
    ,ui
    ,ajax_helper
    ,pt_delete    
    ,pt_get
    ,pt_update
    ,pt_insert
    ,pt_prompt
)
{
    var PAYMENT_TYPE_LST = null;
    var payment_type_tbl = null;

    function update_payment_type_lst(lst,item){
        for(var i = 0;i<lst.length;i++){
            if(lst[i].id == item.id){
                lst[i] = item;
                break;
            }
        }
    }

    function delete_pt(pt_id){
        var pt_delete_b = pt_delete.exe.bind(pt_delete.exe,pt_id);
        async.waterfall([pt_delete_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }

            PAYMENT_TYPE_LST = result;
            display_pt_table();
        });
    }

    function update_pt_handler(index){
        var pt = PAYMENT_TYPE_LST[index];
        var prompt_b = pt_prompt.exe.bind(pt_prompt.exe,pt.name);
        async.waterfall([prompt_b],function(error,result){
            if(error){
                if(error == pt_prompt.ERROR_DELETE_PAYMENT_TYPE){
                    delete_pt(pt.id);
                }else{
                    error_lib.alert_error(error);
                }                
                return;
            }
            var new_pt_name = result;

            var update_b = pt_update.exe.bind(pt_update.exe,pt.id,new_pt_name);
            async.waterfall([update_b],function(error,result){
                if(error){
                    error_lib.alert_error(error);            
                    return;
                }        
                var new_pt = result;
                update_payment_type_lst(PAYMENT_TYPE_LST,new_pt);
                display_pt_table();                        
            });
        });
    }

    function insert_pt_handler(){
        var prompt_b = pt_prompt.exe.bind(pt_prompt.exe,null/*prefill*/);
        async.waterfall([prompt_b],function(error,result){
            if(error){
                if(error == pt_prompt.ERROR_DELETE_PAYMENT_TYPE){
                    //do nothing
                }else{
                    error_lib.alert_error(error);
                }                
                return;
            }
            var new_pt_name = result;
            var insert_b = pt_insert.exe.bind(pt_insert.exe,new_pt_name);
            async.waterfall([insert_b],function(error,result){
                if(error){
                    if(error == pt_prompt.ERROR_DELETE_PAYMENT_TYPE){
                        return;
                    }
                    else{
                        error_lib.alert_error(error);
                    }
                    return;
                }        
                var new_pt = result;
                PAYMENT_TYPE_LST.push(new_pt);
                display_pt_table();                        
            });
        });

    }

    function display_pt_table(){
        payment_type_tbl.innerHTML = "";
        var tr;var td;

        //columns
        tr = payment_type_tbl.insertRow(-1);
        var columns = ['name','edit'];
        for(var i = 0;i<columns.length;i++){
            td = tr.insertCell(-1);
            td.innerHTML = columns[i];
        }
        
        for(var i = 0;i<PAYMENT_TYPE_LST.length;i++){

            tr = payment_type_tbl.insertRow(-1);
            var cur_pt = PAYMENT_TYPE_LST[i];

            //name
            td = tr.insertCell(-1);
            td.innerHTML = cur_pt.name;

            //edit
            td = tr.insertCell(-1)
            td.innerHTML = 'edit';
            (function(index){
                td.addEventListener('click',function(){
                    update_pt_handler(index);
                });   
            })(i);
        }
    }

    function exe(callback){
        
        var html_str = 
            '<div id="payment_type_dlg">' +
                '<input type="button" id="add_payment_type_btn" value="add">' +
                '<table id="payment_type_tbl" border="1"></table>' +
            '</div>';

        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'payment type',
                zIndex: 10000,
                autoOpen: true,
                width: 700,
                height: 500,
                buttons : 
                [{text:'exit', click: function(){callback(null,PAYMENT_TYPE_LST);$('#payment_type_dlg').dialog('close');}}],
                open: function( event, ui ) 
                {
                    $('#add_payment_type_btn').click(insert_pt_handler);
                    payment_type_tbl = document.getElementById('payment_type_tbl');
                    async.waterfall([pt_get.exe],function(error,result){
                        PAYMENT_TYPE_LST = result;
                        display_pt_table();
                    });
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });  
    }

    return{
         exe:exe
    }
});