var mod = angular.module('model.group');
mod.requires.push.apply(mod.requires,[
    'model.store_product'
])

mod.factory('model.group.Group',
[
    '$injector',
function(
    $injector
){
    function Group(id,name,sp_lst){
        this.id = id;
        this.name = name;
        this.sp_lst = sp_lst;
    }
    Group.build = function(data){
        var sp_lst = null;
        var Store_product = $injector.get('model.store_product.Store_product');
        if(data.sp_lst != undefined){
            sp_lst = data.sp_lst.map(Store_product.build)
        }
        return new Group(data.id,data.name,sp_lst);
    }
    return Group;
}])
