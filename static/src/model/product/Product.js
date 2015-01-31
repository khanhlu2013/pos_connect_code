var mod = angular.module('model.product');

mod.requires.push.apply(mod.requires,[
    'share.util'
]);

mod.factory('model.product.Product',[
    '$injector',
    'model.product.Prod_sku_assoc',
    'share.util.number',
    'share.util.misc',
function(
    $injector,
    Prod_sku_assoc,
    number_util,
    misc_util
){
    function Product(product_id,name,sp_lst,prod_sku_assoc_lst){
        this.product_id = product_id;
        this.name = name;
        this.sp_lst = sp_lst;
        this.prod_sku_assoc_lst = prod_sku_assoc_lst;
    }

    Product.prototype = {
         constructor : Product
        ,get_sp_lst : function(sku){
            if(sku === null || sku === undefined){
                return this.sp_lst
            }else{
                var temp_lst = this.prod_sku_assoc_lst.filter(function(item){
                    return item.sku_str === sku;
                });
                if(temp_lst.length === 0){
                    return [];
                }else if(temp_lst.length !== 1){
                    throw Exception('Bug: product model is corrupted.');
                }else{
                    var prod_sku_assoc = temp_lst[0];
                    var store_lst = prod_sku_assoc.store_lst;
                    var result = [];
                    for(var i = 0;i<this.sp_lst.length;i++){
                        var cur_sp = this.sp_lst[i];
                        if(_is_sp_in_store_lst(cur_sp,store_lst)){
                            result.push(cur_sp);
                        }
                    }
                    return result;
                }
            }
        }
        ,get_suggest_main : function(field){
            /*
                price and cost: we use median, and median does not have percent. so main suggest is a single value without associate percent
                name,crv,taxable: we use mode, and mode does have percent. so main suggest is a dictionary with value and percent.
            */
            if(field === 'price' || field === 'cost'){
                return _get_median(this._get_suggest_raw_detail(field));
            }else{
                var lst = this._get_mode_statistic(field);
                if(lst.length !== 0){
                    return lst[0];
                }else{
                    return null;
                }            
            }
        }
        ,get_suggest_extra : function(field){
            if(field === 'price' || field === 'cost'){
                return _unique_and_compress(this._get_suggest_raw_detail(field));
            }else{
                return this._get_mode_statistic(field);
            }
        }
        ,_get_mode_statistic : function(field){
            if(field === 'price' || field ==='cost'){
                return null;//we don't calculate mode for these 2 field
            }

            var lst = this._get_suggest_raw_detail(field);
            var stat_lst = [];
            for(var i = 0;i<lst.length;i++){
                var key = lst[i];
                var stat_item = _get__keyCountPercent__item_in_lst_base_on_key(key,stat_lst);
                if(stat_item === null){
                    stat_item = {value:key,count:1,percent:null}
                    stat_lst.push(stat_item);
                }else{
                    stat_item.count += 1;
                }
            }
            //calculate sum
            var sum = 0;
            for(var i = 0;i<stat_lst.length;i++){
                sum += stat_lst[i].count;
            }

            //calculate percent
            for(var i = 0;i<stat_lst.length;i++){
                stat_lst[i].percent = Math.round(stat_lst[i].count / sum * 100);
            }   
            return stat_lst.sort(function(a,b){
                return b.count - a.count; 
            });        
        }
        ,_get_suggest_raw_detail : function(field){
            var lst = [];
            var sp_lst = this.sp_lst;
            for(var i = 0;i<sp_lst.length;i++){
                     if(field == 'price')       {if(sp_lst[i].price!=null)      {lst.push(sp_lst[i].price);}}
                else if(field == 'cost')        {if(sp_lst[i].get_cost()!=null) {lst.push(sp_lst[i].get_cost());}}
                else if(field == 'crv')         {if(sp_lst[i].get_crv()!=null)  {lst.push(sp_lst[i].get_crv());}}
                else if(field == 'name')                                        {lst.push(sp_lst[i].name);}
                else if(field == 'is_taxable')                                  {lst.push(sp_lst[i].is_taxable);}                    
                else                                                            {return null;}
            }
            return lst;
        }
    }
    function _get__keyCountPercent__item_in_lst_base_on_key(key,lst){
        var result = null;
        for(var i = 0;i<lst.length;i++){
            if(lst[i].value === key){
                result = lst[i];
                break;
            }
        }
        return result;
    }
    function _is_sp_in_store_lst(sp,store_lst){
        var result = false;
        for(var i =0;i<store_lst.length;i++){
            if(sp.store_id === store_lst[i]){
                result = true;
                break;
            }
        }
        return result;
    }
    function _unique_and_compress(lst){
        var unique_lst = misc_util.get_unique_lst(lst);
        return unique_lst;
    }
    function _get_median(values) {
        if(values.length == 0){
            return null;
        }

        values.sort( function(a,b) {return b - a;} );
        var half = Math.floor(values.length/2); 
        if (values.length % 2) { 
            return values[half]; 
        }else { 

            return number_util.round_float_2_decimal((values[half-1] + values[half]) / 2.0); 
        }
    } 
    Product.build = function(raw_json){
        Store_product = $injector.get('model.store_product.Store_product');
        var sp_lst = null;
        if(raw_json.store_product_set != undefined){
            sp_lst = raw_json.store_product_set.map(Store_product.build);
        }

        //build prod_sku_assoc
        var prod_sku_assoc_lst = null;
        if(raw_json.prodskuassoc_set!=undefined){
            prod_sku_assoc_lst = raw_json.prodskuassoc_set.map(Prod_sku_assoc.build);
        }

        //actual build
        return new Product(
             raw_json.product_id
            ,raw_json.name
            ,sp_lst
            ,prod_sku_assoc_lst
        )
    }
    return Product;    
}]);