define(['angular'], function (angular) 
{
	'use strict';

	var filter_mod = angular.module('sp_app.filter', []);

    filter_mod.filter('not_show_zero', function () {
        return function(input) {
            if(input == '$0.00'){
                return "";
            }else{
                return input
            }
        };
    });    

    filter_mod.filter('get_item_from_lst_base_on_id',function(){
        return function(lst,id){
            var result = null;
            for(var i = 0;i<lst.length;i++){
                if(lst[i].id === id){
                    result = lst[i];
                    break;
                }
            }
            return result;
        }
    });
});