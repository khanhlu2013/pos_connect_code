define(['angular'], function (angular) 
{
	'use strict';

	var filter_mod = angular.module('store_product_app.filters', []);

	//serialized sp list contain string for Decimal. we going to convert sp, sp.breakdown, sp.kit to have proper float instead of string
	function sp_lst_float_2_str(sp_lst){
    	for(var i = 0;i<sp_lst.length;i++){
    		var sp = sp_lst[i];

    		if(sp.price != null){
    			sp.price = parseFloat(sp.price)
    		}

    		if(sp.value_customer_price != null){
    			sp.value_customer_price = parseFloat(sp.value_customer_price)
    		}   

    		if(sp.crv != null){
    			sp.crv = parseFloat(sp.crv)
    		}        

    		if(sp.cost != null){
    			sp.cost = parseFloat(sp.cost)
    		}            

    		if(sp.buydown != null){
    			sp.buydown = parseFloat(sp.buydown)
    		}          		  		     		     		
    	}
    	return sp_lst;
	}
 	filter_mod.filter('sp_lst_float_2_str', function(){
        return function(sp_lst){
        	sp_lst = sp_lst_float_2_str(sp_lst);
        	
        	for(var i = 0;i<sp_lst.length;i++){
        		var sp = sp_lst[i];
        		sp.breakdown_assoc_lst = sp_lst_float_2_str(sp.breakdown_assoc_lst);
        		sp.kit_assoc_lst = sp_lst_float_2_str(sp.kit_assoc_lst); 
        	}
        	return sp_lst;
        };
	});

 	//helper filter to calculate kit related field. we should only use this method for 3 fields only: crv,buydow,cost
    function compute_sp_kit_field(sp,field,is_recursive_call){
        //NOT A KIT
        if(sp.breakdown_assoc_lst.length == 0){
            if(is_recursive_call){
                return sp[field];
            }else{
                return null;
            }
        }

        //A KIT
        var result = 0.0;
        for(var i = 0;i<sp.breakdown_assoc_lst.length;i++){
            var assoc = sp.breakdown_assoc_lst[i];
            result += (compute_sp_kit_field(assoc.breakdown,field,true/*this is a recursive call*/) * assoc.qty);
        }
        return result;
    }
    filter_mod.filter('compute_sp_kit_field',function(){
        return compute_sp_kit_field;
    });

	return filter_mod;
});