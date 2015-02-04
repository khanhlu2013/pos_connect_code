var mod = angular.module('share.util');

mod.factory('share.util.misc',function(){
    function get_unique_lst(lst) {
        //i assume this would be based on javascript identity operator: ==
        return lst.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []);
    };    

    function get_item_from_lst_base_on_id(id,lst){
        var item = null;
        for(var i = 0;i<lst.length;i++){
            if(lst[i].id == id){
                item = lst[i];
                break;
            }
        }
        return item;
    }
    return{
        get_unique_lst:get_unique_lst,
        get_item_from_lst_base_on_id:get_item_from_lst_base_on_id
    }
});