var mod = angular.module('share.util');

mod.factory('share.util.misc',function(){
    function get_unique_lst(lst) {
        return lst.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []);
    };    

    return{
        get_unique_lst:get_unique_lst
    }
});