define(
[
]
,function
(
)
{
	function get_group_from_lst(id,group_lst){
		var result = null;

		for(var i = 0;i<group_lst.length;i++){
			var group = group_lst[i];
			if(group.id == id){
				result = group;
				break;
			}
		}
		return result;
	}

	return{
		get_group_from_lst:get_group_from_lst
	}
}
);