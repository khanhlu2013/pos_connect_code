define(
[
    'angular'
    //-------
    ,'app/group_app/model'
    ,'app/product_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_app/model',['group_app/model','product_app/model']);

    //Store_product model
    mod.factory('sp_app/model/Store_product',['$injector',function($injector){

        //CONSTRUCTOR
        function Store_product(
            id,
            product_id,
            store_id,
            name,
            price,
            value_customer_price,
            crv,
            is_taxable,
            is_sale_report,
            p_type,
            p_tag,
            cost,
            vendor,
            buydown,
            product,
            group_lst,
            breakdown_assoc_lst,
            kit_assoc_lst
    	){
            this.id = id;
    		this.product_id = product_id;
    		this.store_id = store_id;
    		this.name = name;
    		this.price = price;
    		this.value_customer_price = value_customer_price;
    		this.crv = crv;
    		this.is_taxable = is_taxable;
    		this.is_sale_report = is_sale_report;
    		this.p_type = p_type;
    		this.p_tag = p_tag;
    		this.cost = cost;
    		this.vendor = vendor;
    		this.buydown = buydown;
            this.product = product;
    		this.group_lst = group_lst;
    		this.breakdown_assoc_lst = breakdown_assoc_lst;
    		this.kit_assoc_lst = kit_assoc_lst;
 		}

        //PULIC METHOD
        Store_product.prototype = {
             constructor : Store_product
            ,is_kit : function(){
                return this.breakdown_assoc_lst.length !=0;
            }
            ,get_crv : function(){
                return compute_recursive_field(this,'crv');
            }
            ,get_cost : function(){
                return compute_recursive_field(this,'cost');       
            }
            ,get_buydown : function(){
                return compute_recursive_field(this,'buydown');              
            }    
            ,get_my_sku_assoc_lst : function(){
                var result = [];
                for(var i = 0;i<this.product.prod_sku_assoc_lst.length;i++){
                    var cur_assoc = this.product.prod_sku_assoc_lst[i];
                    var index = cur_assoc.store_lst.indexOf(this.store_id);
                    if(index != -1){
                        result.push(cur_assoc);
                    }
                }   
                return result;                         
            },
            get_ancestor_lst: function(){
                if(this.kit_assoc_lst.length == 0){
                    return [];
                }else{
                    var result = [];
                    for(var i = 0;i<this.kit_assoc_lst.length;i++){
                        var cur_kit = this.kit_assoc_lst[i];
                        var cur_ancestor_lst = cur_kit.get_ancestor_lst();//ancester lst of current kit in this sp
                        for(var j=0;j<cur_ancestor_lst.length;j++){
                            if(get_item_in_lst_base_on_id(cur_ancestor_lst[j].id,result) == null){
                                result.push(cur_ancestor_lst[j]);
                            }
                        }
                    }
                    return result;
                }
            },
            get_decendent_lst: function(){
                if(this.breakdown_assoc_lst.length == 0){
                    return [];
                }else{
                    var result = [];
                    for(var i = 0;i<this.breakdown_assoc_lst.length;i++){
                        var cur_breakdown = this.breakdown_assoc_lst[i].breakdown;
                        var cur_decendent_lst = cur_breakdown.get_decendent_lst();

                        //add itself
                        if(get_item_in_lst_base_on_id(cur_breakdown.id,result) == null){
                            result.push(cur_breakdown);
                        }                        
                        //add decendent
                        for(var j=0;j<cur_decendent_lst.length;j++){
                            if(get_item_in_lst_base_on_id(cur_decendent_lst[j].breakdown.id,result) == null){
                                result.push(cur_decendent_lst[j].breakdown);
                            }
                        }
                    }
                    return result;
                }                
            },
            is_breakdown_can_be_add: function(sp){
                //down lst
                var down_lst = sp.get_decendent_lst();
                down_lst.push(sp);

                //up lst
                var up_lst = this.get_ancestor_lst();
                up_lst.push(this);

                //verify that down_lst and up_lst is not intesec
                for(var i = 0;i<down_lst.length;i++){
                    var cur = down_lst[i];
                    if(get_item_in_lst_base_on_id(cur.id,up_lst)!=null){
                        return false;
                    }
                }
                return true;
            }
        }

        //PRIVATE METHOD
        function get_item_in_lst_base_on_id(id,lst){
            var result = null;
            for(var i = 0;i<lst.length;i++){
                if(lst[i].id == id){
                    result = lst[i];
                    break;
                }
            }
            return result;
        }
    	function str_2_float(str){
    		if(str == null){
    			return null;
    		}else{
    			return parseFloat(str);
    		}
    	}    	
        function compute_recursive_field(sp,field){
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
                result += (compute_recursive_field(assoc.breakdown,field) * assoc.qty);
            }
            return result;
        }    

        //BUILD METHOD
        function _build(raw_json){
            //build group
            var group_lst = [];
            if(raw_json.group_set != undefined){
                var Group = $injector.get('group_app/model/Group');
                group_lst = raw_json.group_set.map(Group.build)
            }

            //build product
            var product = null;
            if(raw_json.product != undefined){
                var Product = $injector.get('product_app/model/Product');
                product = Product.build(raw_json.product);
            }

            //build breakdown assoc list
            var breakdown_assoc_lst = [];
            if(raw_json.breakdown_assoc_lst != undefined && raw_json.breakdown_assoc_lst.length!=0){
                var Kit_breakdown_assoc = $injector.get('sp_app/model/Kit_breakdown_assoc')
                breakdown_assoc_lst = raw_json.breakdown_assoc_lst.map(Kit_breakdown_assoc.build)
            }

            //build kit assoc list
            var kit_assoc_lst = [];
            if(raw_json.kit_assoc_lst != undefined && raw_json.breakdown_assoc_lst.length != 0){
                kit_assoc_lst = raw_json.kit_assoc_lst.map(_build);
            }

            return new Store_product(
                raw_json.id,
                raw_json.product_id,
                raw_json.store_id,
                raw_json.name,
                str_2_float(raw_json.price),
                str_2_float(raw_json.value_customer_price),
                str_2_float(raw_json.crv),
                raw_json.is_taxable,
                raw_json.is_sale_report,
                raw_json.p_type,
                raw_json.p_tag,
                str_2_float(raw_json.cost),
                raw_json.vendor,
                str_2_float(raw_json.buydown),
                product,
                group_lst,
                breakdown_assoc_lst,
                kit_assoc_lst
            );
        }             
    	Store_product.build = _build;
    	return Store_product;
    }])

    //Kit_breakdown_assoc
    mod.factory('sp_app/model/Kit_breakdown_assoc',['$injector',function($injector){
        function Kit_breakdown_assoc(id,breakdown,qty){
            this.id = id;
            this.breakdown = breakdown;
            this.qty = qty;
        }
        Kit_breakdown_assoc.build = function(raw_json){
            var Store_product = $injector.get('sp_app/model/Store_product')
            var breakdown = Store_product.build(raw_json.breakdown);

            return new Kit_breakdown_assoc(
                raw_json.id,
                breakdown,
                raw_json.qty
            );
        }
        return Kit_breakdown_assoc;
    }])
})

/*
sp json
{
    "id":272597,
    "product_id":369491,
    "product":
    {
        "prodskuassoc_set":
        [
            {
                "sku_str":"082184083062",
                "store_set":[221],
                "creator_id":null,
                "product_id":369491
            },
            {
                "sku_str":"082184038710",
                "store_set":[],
                "creator_id":null,
                "product_id":369491
            }
        ]
    },
    "store_id":221,
    "name":"Gentleman Jack 375",
    "price":14.99,
    "value_customer_price":null,
    "crv":0,
    "is_taxable":true,
    "is_sale_report":true,
    "p_type":"Liquor",
    "p_tag":null,
    "cost":10.93,
    "vendor":"coles",
    "buydown":null,
    "group_set":[],
    "breakdown_assoc_lst":[],
    "kit_assoc_lst":[]
}
*/