define(
[
     'lib/ui/ui'
    ,'lib/ajax_helper' 
]
,function
(
     ui
    ,ajax_helper
)
{
    function get_lst(callback){
        ajax_helper.exe('/group/get_lst','GET','get group data ...',null/*data*/,callback);
    }

    function get_item(group_id,callback){
        ajax_helper.exe('/group/get_item','GET','get group data ...',{group_id:group_id}/*data*/,callback);
    }

    return {
    	 get_lst:get_lst
        ,get_item:get_item
    }
});