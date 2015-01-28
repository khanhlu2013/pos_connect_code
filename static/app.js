var app = angular.module('app.productApp', [
    'share.util.csrf',
    'share.filter',
    'share.directive',
    'ui.bootstrap'
])

app.config(['$sceDelegateProvider',function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // 'http://127.0.0.1:8000/*', //i think i need this when i am dealing with partial? (the network product partial)
        // Allow loading from our assets domain.  Notice the difference between * and **.
        // 'https://liquorkhanhlu2013.s3.amazonaws.com/**'
    ]);
}]);



var mod = angular.module('model.group',[]);
var mod = angular.module('model.non_inventory',[]);

angular.module('model.product',[])
var mod = angular.module('model.report',[])
angular.module('model.store_product',[]);
var mod = angular.module('share.ui',[]);
var mod = angular.module('share.util',[])

var app = angular.module('app.productApp');
app.requires.push.apply(app.requires,[
    'model.store_product',
    'share.ui'
])

app.controller('app.productApp.productCtrl',
[
    '$scope',
    'model.store_product.rest',
    'share.ui.alert',
function(
    $scope,
    store_product_rest,
    alert_service
){
    $scope.column_click = function(column_name){
        if($scope.cur_sort_column === column_name){
            $scope.cur_sort_desc = !$scope.cur_sort_desc;
        }else{
            $scope.cur_sort_column = column_name;
            $scope.cur_sort_desc = false;
        }
    }
    $scope.get_sort_class = function(column_name){
        if(column_name === $scope.cur_sort_column){
            return "glyphicon glyphicon-arrow-" + ($scope.cur_sort_desc ? 'down' : 'up');
        }else{
            return '';
        }
    }    
    $scope.name_search = function(is_infinite_scroll){
       
        //return if busy
        if($scope.name_search_busy === true){
            return;
        }

        //clear out search form
        $scope.sku_search_str = "";
        $scope.local_filter = "";
        $scope.name_search_str = $scope.name_search_str.trim();
        if($scope.name_search_str.length === 0){
            $scope.sp_lst = [];
            return;
        }

        var after = null;
        if(is_infinite_scroll === true){
            if($scope.name_search_reach_the_end){
                return;
            }else{
                after = $scope.sp_lst.length;
            }                        
        }else{
            after = 0;
            $scope.sp_lst = [];
            $scope.name_search_reach_the_end = false;                        
        }

        $scope.name_search_busy = true;
        store_product_rest.by_name($scope.name_search_str,after).then(
            function(data){
                if(data.length === 0){
                    $scope.name_search_reach_the_end = true;
                }else{
                    for(var i = 0;i<data.length;i++){
                        $scope.sp_lst.push(data[i]);
                    }                        
                }

                if($scope.sp_lst.length === 0){ 
                    alert_service('no result found for ' + '"' + $scope.name_search_str + '"','info','blue');
                }else{
                    $scope.is_blur_name_search_text_box = true;
                }
                $scope.name_search_busy = false;
            }
            ,function(reason){ 
                alert_service(reason); 
            }
        )
    }

    //SORT
    $scope.cur_sort_column = 'name';
    $scope.cur_sort_desc = false;        

    $scope.sp_lst = [];        
    $scope.name_search_reach_the_end = false;
    $scope.name_search_str = '';
    $scope.is_blur_name_search_text_box = false;
    $scope.name_search_busy = false; 
}])
var mod = angular.module('model.group');
mod.requires.push.apply(mod.requires,[
    'model.store_product'
])

mod.factory('model.group.Group',
[
    '$injector',
function(
    $injector
){
    function Group(id,name,sp_lst){
        this.id = id;
        this.name = name;
        this.sp_lst = sp_lst;
    }
    Group.build = function(data){
        var sp_lst = null;
        var Store_product = $injector.get('model.store_product.Store_product');
        if(data.sp_lst != undefined){
            sp_lst = data.sp_lst.map(Store_product.build)
        }
        return new Group(data.id,data.name,sp_lst);
    }
    return Group;
}])

var mod = angular.module('model.non_inventory');

mod.factory('model.non_inventory.Non_inventory',[function(){
    //CONSTRUCTOR
    function Non_inventory(
         name
        ,price
        ,is_taxable
        ,crv
        ,cost
    ){
        this.name = name;
        this.price = price;
        this.is_taxable = is_taxable;
        this.crv = crv;
        this.cost = cost;
    }
    Non_inventory.prototype = {
         constructor : Non_inventory
        ,get_b4_tax_price : function(){
            var result =  this.price + this.crv;
            return result;
        }
        ,get_product_tax : function(tax_rate){
            var result = 0.0;
            if(this.is_taxable){
                result = this.get_b4_tax_price() * tax_rate / 100.0
            }
            return result;
        }
        ,get_otd_price : function(tax_rate){
            return this.get_b4_tax_price() + this.get_product_tax(tax_rate);
        }
    }        

    return Non_inventory;
}]);  
var mod = angular.module('model.product')

mod.factory('model.product.Prod_sku_assoc',[function(){
    function Prod_sku_assoc(product_id,creator_id,store_lst,sku_str){
        this.product_id = product_id;
        this.creator_id = creator_id;
        this.store_lst = store_lst;
        this.sku_str = sku_str;
    }
    Prod_sku_assoc.build = function(raw_json){
        return new Prod_sku_assoc(
             raw_json.product_id
            ,raw_json.creator_id
            ,raw_json.store_set
            ,raw_json.sku_str
        );
    }
    return Prod_sku_assoc;
}])
var mod = angular.module('model.product');

mod.requires.push.apply(mod.requires,[
    'share.util'
])

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
}])
var mod = angular.module('model.report')
mod.requires.push.apply(mod.requires,[
    'model.store_product'
])

mod.factory('model.report.Report',[
    '$injector',
function(
    $injector
){
    function Report(id,name,sp_lst){
        this.id = id;
        this.name = name;
        this.sp_lst = sp_lst;
    }
    Report.build = function(data){
        var sp_lst = null;
        var Store_product = $injector.get('model.store_product.Store_product');
        if(data.sp_lst != undefined){
            sp_lst = data.sp_lst.map(Store_product.build)
        }
        return new Report(data.id,data.name,sp_lst);
    }
    return Report;
}]);
var mod = angular.module('model.store_product');

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
var mod = angular.module('model.store_product');
mod.requires.push.apply(mod.requires,
[
    'model.report',
    'model.group',    
    'model.product',
    'share.util'
])

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
}])
var mod = angular.module('model.store_product')
mod.requires.push.apply(mod.requires,[
    'model.product'
])

mod.factory('model.store_product.rest',
[
    '$q',
    '$http',
    'model.store_product.Store_product',
    'model.product.Product',
function(
    $q,
    $http,
    Store_product,
    Product
){
    function by_id(product_id){
        var defer = $q.defer();
        $http({
            url:'/sp/search_by_product_id',
            method:'GET',
            params:{product_id:product_id}
        }).then(
             function(data){ 
                var sp = Store_product.build(data.data);
                defer.resolve(sp); 
            }
            ,function(reason){ 
                defer.reject(reason); 
            }
        )

        return defer.promise;
    }
    
    function by_name(name_search_str,after){
        var defer = $q.defer();

        name_search_str = name_search_str.trim();
        if(name_search_str.length == 0){
            defer.reject('error: name search is empty');
            return defer.promise;
        }

        var words = name_search_str.split(' ');
        if(words.length > 2){
            defer.reject('error: search 2 words maximum');
            return defer.promise;
        }

        $http({
            url: '/sp/search_by_name_angular',
            method : "GET",
            params: {name_str:name_search_str,after:after}
        })
        .then(
            function(data){
                defer.resolve(data.data.map(Store_product.build));
            },function(reason){
                defer.reject(reason);
            }
        )
        return defer.promise
    }
    
    function by_sku(sku_search_str){
        sku_search_str = sku_search_str.trim();
        if(sku_search_str.length == 0){ return $q.reject('error: sku is empty'); }
        if(sku_search_str.indexOf(' ') >= 0){ return $q.reject('error: sku cannot contain space'); }

        var defer = $q.defer();
        $http({
            url:'/sp/search_by_sku_angular',
            method:'GET',
            params:{sku_str:sku_search_str}
        }).then(
            function(data){
                var result = {
                     prod_store__prod_sku__1_1:data.data.prod_store__prod_sku__1_1.map(Store_product.build)
                    ,prod_store__prod_sku__1_0:data.data.prod_store__prod_sku__1_0.map(Store_product.build)
                    ,prod_store__prod_sku__0_0:data.data.prod_store__prod_sku__0_0.map(Product.build)
                };
                defer.resolve(result);
            },
            function(reason){ 
                defer.reject(reason); 
            }
        )
        return defer.promise;
    }

    function by_name_sku(search_str,after){
        var token_lst = search_str.split(' ');
        if(token_lst.length > 2){
            return $q.reject('2 words search max');
        }

        var defer = $q.defer();
        $http({
            url : '/sp/search_by_name_sku_angular',
            method: 'GET',
            params : {'search_str':search_str,'after':0}
        })
        .then(
            function(data){ 
                defer.resolve(data.data.map(Store_product.build));
            }
            ,function(reason){
                defer.reject(reason);
            }
        )
        return defer.promise;
    }

    return{
        by_id:by_id,
        by_name:by_name,
        by_sku:by_sku,
        by_name_sku:by_name_sku
    }
}])

var mod = angular.module('share.directive',[]);


mod.directive('ngEnter', function () {
    //need this to make text box work for enter key
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

mod.directive('blurMe', ['$timeout','$parse',function($timeout, $parse) {
    return {
        //scope: true,   // optionally create a child scope
        link: function(scope, element, attrs) {
            var model = $parse(attrs.blurMe);
            scope.$watch(model, function(value) {
                if(value === true) { 
                        $timeout(function() {
                        element[0].blur(); 
                    });
                }
            });
            // to address @blesh's comment, set attribute value to 'false'
            // on blur event:
            element.bind('focus', function() {
                if(model.assign !== undefined){
                  scope.$apply(model.assign(scope, false));
                }
            });
        }
    };
}]); 

mod.directive('focusMe', ['$timeout','$parse',function($timeout, $parse) {
    return {
        //scope: true,   // optionally create a child scope
        link: function(scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function(value) {
                if(value === true) { 
                    $timeout(function() {
                        element[0].focus(); 
                        if(element[0].select !== undefined){
                             element[0].select();
                        }
                    });
                }
            });
            // to address @blesh's comment, set attribute value to 'false'
            // on blur event:
            element.bind('blur', function() {
                if(model.assign !== undefined){
                    scope.$apply(model.assign(scope, false));
                }
            });
        }
    };
}]);  
var mod = angular.module('share.filter', []);

mod.filter('not_show_zero', function () {
    return function(input) {
        if(input === '$0.00'){
            return "";
        }
        else if(input === '0'){
            return "";
        }
        else if(input === 0){
            return "";
        }
        else{
            return input
        }
    };
});    

mod.filter("emptyToEnd", function () {
    return function (array, key) {
        if (!angular.isArray(array)) return;
        var present = array.filter(function (item) {
            if(key.indexOf('()') != -1){
                return item[key.replace('()','')]();
            }else{
                return item[key];    
            }
        });
        var empty = array.filter(function (item) {
            if(key.indexOf('()') != -1){
                return !item[key.replace('()','')]();
            }else{
                return !item[key];    
            }
        });
        return present.concat(empty);
    };
});
var mod = angular.module('share.ui');

mod.factory('share.ui.alert',['$modal',function($modal){
    return function(alert_obj,title,color){
        if(title === undefined){
            title = 'alert';
        }
        if(color === undefined){
            color = 'red';
        }
        var message;
        if(typeof(alert_obj) === 'string'){
            message = alert_obj;
            if(message === '_cancel_' || message === undefined/*cancel click*/ || message === 'backdrop click' || message === 'escape key press'){
                return;
            }
        }else{
            if(alert_obj.constructor.name === 'PouchError' || alert_obj.constructor.name === 'Error'){
                title = 'Pouch error: ' + alert_obj.name;
                message = alert_obj.message;
            }else{
                if(alert_obj.status === 0){
                    message = 'internet is disconnected!'
                }else{
                    title = 'please report ajax bug:'
                    message = 'url: ' + alert_obj.config.url;
                }                    
            }
        }

        var warning_class = ""
        if(color == 'green'){
            warning_class = 'alert alert-success'
        }else if(color == 'blue'){
            warning_class = 'alert alert-info'
        }else if(color == 'orange'){
            warning_class = 'alert alert-warning'
        }else if(color == 'red'){
            warning_class = 'alert alert-danger'
        }

        var template = 
        '<form name="form" novalidate>' +
            '<div id="service/ui/alert/dialog" class="modal-header ' + warning_class + '">' +
                '<h3 class="modal-title">' + title + '</h3>' +
            '</div>' +
            '<div class="modal-body">' +
                '<h1 id="service/ui/alert/message_lbl">' + message + '</h1>' +
            '</div>' +
            '<div class="modal-footer">' +
                '<button id="service/ui/alert/ok_btn" type="submit" class="btn btn-success" ng-click="ok()">ok</button>' +
            '</div>' +
        '</form>'
        ;


        var ModalCtrl = function($scope,$modalInstance){
            $scope.ok = function(){
                $modalInstance.close();
            }
        }
        ModalCtrl.$inject = ['$scope','$modalInstance'];
        var dlg = $modal.open({
            template : template,
            controller : ModalCtrl,
            size : 'md'
        });         
    }
}]);
angular.module('share.util.csrf',[]).config(['$httpProvider',function($httpProvider) {
    //boilerplate code to make angularjs to work with django in ajax term
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';           
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $httpProvider.defaults.withCredentials = true;

    var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
          
        for(name in obj) {
            value = obj[name];
            
            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    };
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
}]);
var mod = angular.module('share.util');

mod.factory('share.util.misc',function(){
    function get_unique_lst(lst) {
        return lst.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []);
    };    

    return{
        get_unique_lst:get_unique_lst
    }
})
var mod = angular.module('share.util');
mod.factory('share.util.number',function(){
    function round_float_2_decimal(num){
        return parseFloat(num.toFixed(2));
    }
    function round_float_1_decimal(num){
        return parseFloat(num.toFixed(1));
    }      

    return{
        round_float_1_decimal:round_float_1_decimal,
        round_float_2_decimal:round_float_2_decimal
    }    
})