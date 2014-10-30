define(
[
    'angular'
    //-------
    ,'app/sp_app/service/api/search'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_app/service/name_search',
    [
        'sp_app/service/api/search'
    ]);
    mod.factory('sp_app/service/name_search',[
        'sp_app/service/api/search'
    ,function(
        search_api
    ){
        var Name_search_engine = function() {
            this.items = [];
            this.busy = false;
            this.after = '';
            this.name_search_str;
            this.sku_search_str;
        };

        Name_search_engine.prototype.nextPage = function() {
            if (this.busy) return;
            this.busy = true;

            if(this.name_search_str !== null){
                search_api.name_search(this.name_search_str,this.after).success(function(items) {
                    for (var i = 0; i < items.length; i++) {
                        this.items.push(items[i].data);
                    }
                    this.after = this.items.length - 1;
                    this.busy = false;
                }.bind(this));                
            }

        };

        return Name_search_engine;
    }]);
})