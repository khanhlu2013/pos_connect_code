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

	//serialized sp list contain string for Decimal. we going to convert sp, sp.breakdown, sp.kit to have proper float instead of string
	function sp_lst_str_2_float(sp_lst){
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
    
 	filter_mod.filter('sp_lst_str_2_float', function(){
        return function(sp_lst){
        	sp_lst = sp_lst_str_2_float(sp_lst);
        	
        	for(var i = 0;i<sp_lst.length;i++){
        		var sp = sp_lst[i];
        		sp.breakdown_assoc_lst = sp_lst_str_2_float(sp.breakdown_assoc_lst);
        		sp.kit_assoc_lst = sp_lst_str_2_float(sp.kit_assoc_lst); 
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
        
        //CHECK NULL (when create new, sp is null)
        if(sp == null){
            return undefined;
        }

        //when create new and after edit a field, angular init sp to be not null but this sp still don't have breakdown_assoc_lst
        if(sp.breakdown_assoc_lst == undefined){
            return undefined;
        }

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
        return parseFloat(result.toFixed(2));
    }
    filter_mod.filter('compute_sp_kit_field',function(){
        return compute_sp_kit_field;
    });

    filter_mod.filter('is_kit',function(){
        return function(sp){
            if(sp == null){
                return false;
            }else if(sp.breakdown_assoc_lst == undefined){
                return false;                
            }else{
                return sp.breakdown_assoc_lst.length != 0;
            }
        }
    })

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

    filter_mod.filter('is_sku_assoc_deletable',function(){
        return function(prod_sku_assoc,store_id){
            return (prod_sku_assoc.store_set.length == 1) && (prod_sku_assoc.store_set[0] == prod_sku_assoc.creator_id) && (prod_sku_assoc.creator_id==store_id)
        }
    })

    filter_mod.filter('sku_in_store',function(){
        return function(prod_sku_assoc_lst,store_id){
            var result = [];
            for(var i = 0;i<prod_sku_assoc_lst.length;i++){
                var assoc = prod_sku_assoc_lst[i];
                if(assoc.store_set.indexOf(store_id)!=-1){
                    result.push(assoc);
                }
            }
            return result;
        }
    })

    function mm_item_str_2_float(mm){
        mm.mix_match_child_set = sp_lst_str_2_float(mm.mix_match_child_set);
        mm.mm_price = parseFloat(mm.mm_price);
        return mm;
    } 

    filter_mod.filter('mix_match_app.filter.mm_item_str_2_float',[function($filter){
        return function(mm){
			return mm_item_str_2_float(mm);
        }
    }]);

    filter_mod.filter('mix_match_app.filter.mm_lst_str_2_float',[function(){
        return function(mm_lst){
            for(var i = 0;i<mm_lst.length;i++){
                mm_lst[i] = mm_item_str_2_float(mm_lst[i]);
            }
            return mm_lst;
        }
    }]);        

	// return filter_mod;
});