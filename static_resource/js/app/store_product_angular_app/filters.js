define(['angular'], function (angular) 
{
	'use strict';

	var filter_mod = angular.module('store_product_app.filters', []);

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

 	
    function compute_sp_kit_field(sp,field){
        /*
            DESC    :helper filter to recursively calculate kit related field: 
            PRE     :only call this method on kit related field: CRV, BUYDOWN,COST
            RETURN  
                    .if it is a kit: recursively calculate the field
                    .if it is not a kit: return sp.field

        */
        // we should only use this method for 3 fields only: crv,buydow,cost. RETURN NULL IF SP IS NOT A KIT
        
        //NOT A KIT
        if(sp.breakdown_assoc_lst.length == 0){
            return sp[field];
        }

        //A KIT
        var result = 0.0;
        for(var i = 0;i<sp.breakdown_assoc_lst.length;i++){
            var assoc = sp.breakdown_assoc_lst[i];
            result += (compute_sp_kit_field(assoc.breakdown,field) * assoc.qty);
        }
        return result;
    }
    filter_mod.filter('compute_sp_kit_field',function(){
        return compute_sp_kit_field;
    });

    filter_mod.filter('is_kit',function(){
        return function(sp){
            return sp.breakdown_assoc_lst.length != 0;
        }
    })

	return filter_mod;
});