define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_app/service/convert',[]);
    mod.factory('sp_app/service/convert/lst',['sp_app/service/convert/item',function(convert_sp_item){
    	return function(sp_lst){
    		for(var i = 0;i<sp_lst.length;i++){
    			convert_sp_item(sp_lst[i]);
    		}
    		return sp_lst;
    	}
    }])

	function _helper(sp){
		/*
			this helper function convert sp main info, but not breakdown_lst and kit_lst
		*/
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
		return sp;
	}

    mod.factory('sp_app/service/convert/item',function(){
    	return function(sp){
    		//main info
    		_helper(sp);

    		//kit_lst
            if(sp.kit_assoc_lst != undefined){
                for(var i = 0;i<sp.kit_assoc_lst.length;i++){
                    _helper(sp.kit_assoc_lst[i]);
                }                
            }

    		//breakdown_lst
            if(sp.breakdown_assoc_lst != undefined){
                for(var i = 0;i<sp.breakdown_assoc_lst.length;i++){
                    _helper(sp.breakdown_assoc_lst[i]);
                }                
            }

			return sp;			
    	}	
    })
})