define(
	[]
	,function()
{
    function get_parent(position,parent_lst){
        var parent = null;
        for(var i = 0;i<parent_lst.length;i++){
            if(parent_lst[i].position == position){
                parent = parent_lst[i];
                break;
            }
        }

        return parent;
    }

    function get_child(parent,child_position){
        var child = null;

        for(var i = 0;i<parent.child_set.length;i++){
            if(parent.child_set[i].position == child_position){
                child = parent.child_set[i];
                break;
            }
        }

        return child;
    }

    return {
    	 get_parent:get_parent
    	,get_child:get_child
    }
});