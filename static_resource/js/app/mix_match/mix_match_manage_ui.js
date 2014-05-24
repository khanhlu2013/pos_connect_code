define(
[
     'lib/async'
    ,'lib/error_lib'
    ,'lib/ui/ui'
    ,'lib/ajax_helper'
    ,'app/mix_match/mix_match_prompt'   
    ,'app/mix_match/mix_match_online_inserter'  
    ,'app/mix_match/mix_match_online_updator'  
    ,'app/mix_match/mm_online_delete'    
    ,'app/mix_match/mix_match_get'
]
,function
(
     async
    ,error_lib
    ,ui
    ,ajax_helper
    ,mm_prompt
    ,mm_inserter
    ,mm_updator
    ,mm_online_delete    
    ,mm_get
)
{
    var TAX_RATE = localStorage.getItem('tax_rate');
    var MIX_MATCH_LST = null;
    var mix_match_tbl = null;

    function update_mix_match_lst(lst,item){
        for(var i = 0;i<lst.length;i++){
            if(lst[i].id == item.id){
                lst[i] = item;
                break;
            }
        }
    }

    function delete_mm(mm_id){
        var mm_online_delete_b = mm_online_delete.exe.bind(mm_online_delete.exe,mm_id);
        async.waterfall([mm_online_delete_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }

            MIX_MATCH_LST = result;
            display_mix_match_table();
        });
    }

    function update_mix_match_handler(index){
        var parent = MIX_MATCH_LST[index];
        var mm_child_sp_lst = [];
        for(var i = 0;i<parent.mix_match_child_set.length;i++){
            mm_child_sp_lst.push(parent.mix_match_child_set[i].store_product);
        }

        var mm_prompt_b = mm_prompt.exe.bind(mm_prompt.exe
            ,parent.name
            ,parent.qty
            ,parent.unit_discount
            ,mm_child_sp_lst
            ,TAX_RATE
        );

        async.waterfall([mm_prompt_b],function(error,result){
            if(error){
                if(error == mm_prompt.ERROR_DELETE_MIX_MATCH){
                    delete_mm(parent.id);
                }else{
                    error_lib.alert_error(error);
                }
                return;
            }

            var mm_updator_b = mm_updator.exe.bind(mm_updator.exe ,parent.id,result);
            async.waterfall([mm_updator_b],function(error,result){
                if(error){
                    error_lib.alert_error(error);
                    return;
                }
                update_mix_match_lst(MIX_MATCH_LST,result)
                display_mix_match_table();
            });
        });        
    }

    function insert_mix_match_handler(){

        var mm_prompt_b = mm_prompt.exe.bind(mm_prompt.exe
            ,null//name
            ,null//qty
            ,null//unit_discount
            ,[]//mix_match_child_sp_lst
            ,TAX_RATE
        )

        async.waterfall([mm_prompt_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }

            var mm_inserter_b = mm_inserter.exe.bind(mm_inserter.exe,result);
            async.waterfall([mm_inserter_b],function(error,result){
                if(error){
                    error_lib.alert_error(error);
                    return;
                }
                MIX_MATCH_LST.push(result);
                display_mix_match_table();
            })
        });
    }

    function display_mix_match_table(){
        mix_match_tbl.innerHTML = "";
        var tr;var td;

        //columns
        tr = mix_match_tbl.insertRow(-1);
        var columns = ['name','qty','unit_discount','out_the_door_price','edit']
        for(var i = 0;i<columns.length;i++){
            td = tr.insertCell(-1);
            td.innerHTML = columns[i];
        }
        
        for(var i = 0;i<MIX_MATCH_LST.length;i++){

            tr = mix_match_tbl.insertRow(-1);
            var cur_mix_match = MIX_MATCH_LST[i];

            //name
            td = tr.insertCell(-1);
            td.innerHTML = cur_mix_match.name;

            //qty
            td = tr.insertCell(-1);
            td.innerHTML = cur_mix_match.qty;

            //unit_discount
            td = tr.insertCell(-1);
            td.innerHTML = cur_mix_match.unit_discount;           

            //out_the_door_price
            td = tr.insertCell(-1);
            td.innerHTML = 'xx';

            //edit
            td = tr.insertCell(-1)
            td.innerHTML = 'edit';
            (function(_i){
                td.addEventListener('click',function(){
                    update_mix_match_handler(_i);
                });   
            })(i);
        }
    }

    function exe(callback){
        
        var html_str = 
            '<div id="mix_match_manage_dlg">' +
                '<input type="button" id="add_mix_match_btn" value="add">' +
                '<table id="mix_match_tbl" border="1"></table>' +
            '</div>';

        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'mix match',
                zIndex: 10000,
                autoOpen: true,
                width: 700,
                height: 500,
                buttons : 
                [{text:'exit', click: function(){callback(null,MIX_MATCH_LST);$('#mix_match_manage_dlg').dialog('close');}}],
                open: function( event, ui ) 
                {
                    $('#add_mix_match_btn').click(insert_mix_match_handler);
                    mix_match_tbl = document.getElementById('mix_match_tbl');
                    async.waterfall([mm_get.exe],function(error,result){
                        MIX_MATCH_LST = result;
                        display_mix_match_table();
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