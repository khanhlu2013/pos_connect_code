define(['angular'], function (angular) 
{
	'use strict';

	var filter_mod = angular.module('sp_app.filter', []);

    function get_mode(array)
    {
        if(array.length == 0)
            return null;
        
        var modeMap = {};
        var maxEl = array[0], maxCount = 1;
        for(var i = 0; i < array.length; i++)
        {
            var el = array[i];
            if(modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;  
            if(modeMap[el] > maxCount)
            {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        return maxEl;
    }

    function get_median(values) {

        if(values.length == 0){
            return null;
        }

        values.sort( function(a,b) {return a - b;} );
        var half = Math.floor(values.length/2); 
        if (values.length % 2) { return values[half]; } 
        else { return (values[half-1] + values[half]) / 2.0; } 
    } 

    filter_mod.filter('get_product_suggest_info',function(){
        return function(product_json,type){
            var sp_lst = product_json.store_product_set;
            var lst = [];

            for(var i = 0;i<sp_lst.length;i++){
                if(type == 'price'){lst.push(sp_lst[i].price);}
                else if(type == 'cost'){lst.push(sp_lst[i].cost);}
                else if(type == 'crv'){lst.push(sp_lst[i].crv);}
                else if(type == 'is_taxable'){lst.push(sp_lst[i].is_taxable);}
                else{
                    return null;
                }                
            }

            if(type == 'price' || type == 'cost'){
                return get_median(lst);
            }else if(type == 'crv' || type == 'is_taxable'){
                return get_mode(lst);
            }
        }
    });

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

    filter_mod.filter('is_obj_sp',function(){
        return function(obj){
            return obj.is_taxable != undefined;
        }
    })

    filter_mod.filter('is_obj_p',function(){
        return function(obj){
            return obj.is_taxable == undefined;
        }
    })
});