define(
[
	 'lib/async'
	,'app/group/group_action_prompt'

]
,function
(
	 async
	,group_action_prompt
)
{
    function ajax_action(id,result,callback){


        var data = {
             id:id
            ,price:result.price
            ,crv:result.crv
            ,is_taxable:result.is_taxable
            ,is_sale_report:result.is_sale_report
            ,p_type:result.p_type
            ,p_tag:result.p_tag
            ,vendor:result.vendor
            ,cost:result.cost
            ,buydown:result.buydown 
        }        

        $.ajax({
             url : "/group/action"
            ,type : "POST"
            ,dataType: "json"
            ,data : data
            ,success : function(data,status_str,xhr) {
                callback(null,data);
            }
            ,error : function(xhr,status_str,err) {
                callback(xhr);
            }
        });        
    }

    function exe(group,callback){

        var ajax_action_b = ajax_action.bind(ajax_action,group.id)
        async.waterfall([group_action_prompt.exe,ajax_action_b],function(error,result){
            callback(error,result);
        });        
    }

    return{
    	exe:exe
    }	
});