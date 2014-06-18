define(
[
     'lib/async'
    ,'app/mix_match/mix_match_validator'
    ,'app/store_product/store_product_util'
    ,'lib/ui/ui'
]
,function
(
     async
    ,mm_validator 
    ,sp_util
    ,ui
)
{
    var ERROR_MIX_MATCH_VALIDATION_FAIL = 'ERROR_MIX_MATCH_VALIDATION_FAIL';

    function exe(id,result,callback){

        var error_lst = mm_validator.validate(result);
        if(error_lst.length!=0){
            callback(ERROR_MIX_MATCH_VALIDATION_FAIL);
            return;
        }

        var pid_comma_separated_lst_str = sp_util.get_comma_separated_pid_lst(result.mix_match_child_sp_lst);

        var data = {
             id:id
            ,name:result.name
            ,qty:result.qty
            ,mm_price:result.mm_price
            ,is_include_crv_tax:result.is_include_crv_tax
            ,pid_comma_separated_lst_str:pid_comma_separated_lst_str
        }        
        ui.ui_block('updating deal ...');
        $.ajax({
             url : "/mix_match/update"
            ,type : "POST"
            ,dataType: "json"
            ,data : data
            ,success : function(data,status_str,xhr) {
                ui.ui_unblock();
                callback(null,data);
            }
            ,error : function(xhr,status_str,err) {
                ui.ui_unblock();
                callback(xhr);
            }
        });
    }

    return {
         exe:exe
        ,ERROR_MIX_MATCH_VALIDATION_FAIL:ERROR_MIX_MATCH_VALIDATION_FAIL
    }
});