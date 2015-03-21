var mod = angular.module('model.store_product');
mod.requires.push.apply(mod.requires,
[
    'model.report',
    'model.group',    
    'model.product',
    'share.util'
]);

//Store_product model
mod.factory('model.store_product.Store_product',
[
     '$injector'
    ,'share.util.number'
,function(
     $injector
    ,number_util
){

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
        kit_assoc_lst,
        sp_doc_id,
        sp_doc_rev,
        cur_stock,
        report_lst
    ){
        this.id = id;
        this.product_id = product_id;
        this.store_id = store_id;
        this.name = name;
        this.price = str_2_float(price);
        this.value_customer_price = str_2_float(value_customer_price);
        this.crv = str_2_float(crv);
        this.is_taxable = is_taxable;
        this.is_sale_report = is_sale_report;
        this.p_type = p_type;
        this.p_tag = p_tag;
        this.cost = str_2_float(cost);
        this.vendor = vendor;
        this.buydown = str_2_float(buydown);
        this.product = product;
        this.group_lst = group_lst;
        this.breakdown_assoc_lst = breakdown_assoc_lst;
        this.kit_assoc_lst = kit_assoc_lst;
        this.sp_doc_id = sp_doc_id;
        this.sp_doc_rev = sp_doc_rev;
        this.cur_stock = cur_stock;
        this.report_lst = report_lst;
    }

    //PULIC METHOD
    Store_product.prototype = {
         constructor : Store_product
        ,get_offline_create_sku : function(){
            if(this.is_create_offline){ return this.product.prod_sku_assoc_lst[0].sku_str }
            else return null;
        }
        ,is_instantiate_offline : function(){
            return this.get_rev() !== null;
        }
        ,get_rev : function(){
            return this.sp_doc_rev;
        }
        ,is_create_offline : function(){
            return this.product_id === null;
        } 
        ,is_kit : function(){
            if(this.breakdown_assoc_lst === null || this.breakdown_assoc_lst === undefined){
                return false;
            }else{
                return this.breakdown_assoc_lst.length !=0;    
            }
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
            /*
                this method get all direct and in-direct(grand-farther, great-grand-father ... ) ancestors of this sp. 
            */
            if(this.kit_assoc_lst.length === 0){ return []; }
            else{
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
        },
        _get_b4_tax_price:function(){
            return this.price + this.get_crv() - this.get_buydown();
        },
        get_markup:function(){
            var cost = this.get_cost();
            if(cost === null || cost === undefined){
                return null;
            }else{
                var crv = this.get_crv();
                if(crv === null || crv === undefined){
                    crv = 0.0;
                }
                var markup = (this._get_b4_tax_price() - cost - crv) * 100 / cost;
                return number_util.round_float_1_decimal(markup);                    
            }
        },
        get_group_count:function(){
            return this.group_lst.length;
        },            
        get_profit:function(){
            /*this method should not be here, it is a quick fix to get sorting going on in network info. this method only work when this model is attach with a property 'sale'*/
            if(this.sale === undefined){
                return undefined
            }else{
                return this.sale * (this._get_b4_tax_price() - this.get_cost())
            }
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
        if(sp === null || sp === undefined){
            return undefined;
        }

        //NOT A KIT
        if(!sp.is_kit()){
            return sp[field];
        }

        //A KIT
        var result = 0.0;
        for(var i = 0;i<sp.breakdown_assoc_lst.length;i++){
            var assoc = sp.breakdown_assoc_lst[i];
            result += (compute_recursive_field(assoc.breakdown,field) * assoc.qty);
        }
        result = parseFloat(result.toFixed(2));
        return result;
    }    

    //BUILD METHOD
    function _build(raw_json){

        //build report
        var report_lst = [];
        if(raw_json.report_lst != undefined){
            var Report = $injector.get('model.report.Report');
            report_lst = raw_json.report_lst.map(Report.build)
        }

        //build group
        var group_lst = [];
        if(raw_json.group_lst != undefined){
            var Group = $injector.get('model.group.Group');
            group_lst = raw_json.group_lst.map(Group.build)
        }

        //build product
        var product = null;
        if(raw_json.product != undefined){
            var Product = $injector.get('model.product.Product');
            product = Product.build(raw_json.product);
        }

        //build breakdown assoc list
        var breakdown_assoc_lst = [];
        if(raw_json.breakdown_assoc_lst != undefined && raw_json.breakdown_assoc_lst.length!=0){
            var Kit_breakdown_assoc = $injector.get('model.store_product.Kit_breakdown_assoc')
            breakdown_assoc_lst = raw_json.breakdown_assoc_lst.map(Kit_breakdown_assoc.build)
        }

        //build kit assoc list
        var kit_assoc_lst = [];
        if(raw_json.kit_assoc_lst != undefined && raw_json.breakdown_assoc_lst.length != 0){
            kit_assoc_lst = raw_json.kit_assoc_lst.map(_build);
        }

        return new Store_product(
             raw_json.id
            ,raw_json.product_id
            ,raw_json.store_id
            ,raw_json.name
            ,raw_json.price
            ,raw_json.value_customer_price
            ,raw_json.crv
            ,raw_json.is_taxable
            ,raw_json.is_sale_report
            ,raw_json.p_type
            ,raw_json.p_tag
            ,raw_json.cost
            ,raw_json.vendor
            ,raw_json.buydown
            ,product
            ,group_lst
            ,breakdown_assoc_lst
            ,kit_assoc_lst
            ,null//sp_doc_id - this field is only concern when build sp from offline db
            ,null//sp_doc_rev - this field is only concern when build sp from offline db
            ,raw_json.cur_stock
            ,report_lst
        );
    }             
    Store_product.build = _build;
    return Store_product;
}]);

mod.factory('model.store_product.Kit_breakdown_assoc',
[
    '$injector'
,function(
    $injector
){
    function Kit_breakdown_assoc(id,breakdown,qty){
        this.id = id;
        this.breakdown = breakdown;
        this.qty = qty;
    }
    Kit_breakdown_assoc.build = function(raw_json){
        var Store_product = $injector.get('model.store_product.Store_product')
        var breakdown = Store_product.build(raw_json.breakdown);

        return new Kit_breakdown_assoc(
            raw_json.id,
            breakdown,
            raw_json.qty
        );
    }
    return Kit_breakdown_assoc;
}]);