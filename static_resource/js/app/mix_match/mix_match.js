requirejs.config({
     baseUrl: STATIC_URL + 'js'
    ,paths: {
         app : 'app'
        ,lib : 'lib'
    }
});


require(
    [
         'lib/misc/csrf_ajax_protection_setup'
        ,'lib/async'
        ,'lib/error_lib'  
        ,'app/mix_match/mix_match_prompt'   
        ,'app/mix_match/mix_match_online_inserter'  
        ,'app/mix_match/mix_match_online_updator'  
    ]
    ,function
    (
         csrf_ajax_protection_setup
        ,async
        ,error_lib
        ,mm_prompt
        ,mm_inserter
        ,mm_updator
    )
{
    var TAX_RATE = MY_TAX_RATE;
    var MIX_MATCH_LST = MY_MIX_MATCH_LST;
    var mix_match_tbl = document.getElementById('mix_match_tbl');
    csrf_ajax_protection_setup();

    function update_mix_match_lst(lst,item){
        for(var i = 0;i<lst.length;i++){
            if(lst[i].id == item.id){
                lst[i] = item;
                break;
            }
        }
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
                error_lib.alert_error(error);
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
            })
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

            var mm_inserter_b = mm_inserter.exe.bind(mm_inserter.exe
                ,result.name
                ,result.qty
                ,result.unit_discount
                ,result.mix_match_child_sp_lst
            );

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

    $('#add_mix_match_btn').off('click').click(insert_mix_match_handler);
    display_mix_match_table();

});