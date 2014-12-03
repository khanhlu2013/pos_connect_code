define(
[
     'angular'
    //-------
    ,'model/sp/api_offline'
    ,'app/sale_app/service/displaying_scan/compress_ds_lst'
    ,'app/sale_app/model'
    ,'service/misc'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/displaying_scan/calculate_ds_lst',
    [
         'sp/api_offline'
        ,'sale_app/model'
        ,'service/misc'
        ,'sale_app/service/displaying_scan/compress_ds_lst'
    ]);
    mod.factory('sale_app/service/displaying_scan/calculate_ds_lst',
    [
         '$q'
        ,'$rootScope'
        ,'sp/api_offline'
        ,'sale_app/model/Displaying_scan'
        ,'sale_app/model/Mix_match_deal_info'        
        ,'service/misc'
        ,'sale_app/service/displaying_scan/compress_ds_lst'
    ,function(
         $q
        ,$rootScope
        ,search_sp_offline
        ,Displaying_scan
        ,Mix_match_deal_info
        ,misc_service
        ,compress_ds_lst_function
    ){
        //HELPER-
        function is_deal_contain_pid(mm,pid){
            var result = false;

            for(var i = 0;i<mm.sp_lst.length;i++){
                if(mm.sp_lst[i].product_id == pid){
                    result = true;
                    break;
                }
            }

            return result;
        }  
        function _get_posible_deal_from_pid(pid,mm_lst){
            var result = [];

            for(var i = 0;i<mm_lst.length;i++){
                if(is_deal_contain_pid(mm_lst[i],pid)){
                    result.push(mm_lst[i]);
                }
            }

            return result;
        }     
        function merge_a_to_b(a_lst,b_lst){
            for(var i = 0;i<a_lst.length;i++){
                if(misc_service.get_item_from_lst_base_on_id(a_lst[i].id,b_lst)==null){
                    b_lst.push(a_lst[i]);
                }
            }

            return b_lst;
        }        
        function get_posible_deal_from_sp_lst(sp_distinct_lst,mm_lst){
            var result = [];

            for(var i = 0;i<sp_distinct_lst.length;i++){
                var temp_deal_lst = _get_posible_deal_from_pid(sp_distinct_lst[i].product_id,mm_lst);
                merge_a_to_b(temp_deal_lst,result);
            }

            return result
        }
        function form_ds_extract(ps_lst,sp_distinct_lst){
            var result = [];

            for(var i = 0;i<ps_lst.length;i++){
                var cur_ps = ps_lst[i];
                var associated_sp = null;
                if(cur_ps.sp_doc_id != null){
                    associated_sp = misc_service.get_item_from_lst_base_on_property('sp_doc_id'/*property*/,cur_ps.sp_doc_id/*value*/,sp_distinct_lst);
                }

                for(j=0;j<cur_ps.qty;j++){
                    var ds = new Displaying_scan(
                                 associated_sp
                                ,1/*qty*/
                                ,cur_ps.override_price
                                ,cur_ps.discount
                                ,null//mm deal info
                                ,cur_ps.non_inventory
                                ,cur_ps.date
                                ,[]//posible deal list to suggest
                            )                    
                    result.push(ds);                
                }
            }
            return result;
        }      
        function is_ds_available_for_deal(ds,mm_deal){
            var pid = (ds.store_product == null ? null : ds.store_product.product_id);
            if(pid != null && ds.mm_deal_info == null && is_deal_contain_pid(mm_deal,pid)){
                return true;
            }else{
                return false;
            }        
        }             
        function _get_total_deal_count_that_can_be_form(ds_extract_lst,mm_deal){
            /*
                RETURN the total of deal we can form. lets say the deal.qty = 3 and we have 7 item to for this deal. its mean that we can form 2 deals.        
            */

            var avail_qty = 0;//this is the total available item in this ds_lst that we can use to form this deal. An available item is an item that curentlly have no deal assigned to, and this item have to belong to this deal's chilren

            for(var i = 0;i<ds_extract_lst.length;i++){
                if(is_ds_available_for_deal(ds_extract_lst[i],mm_deal))
                {
                    avail_qty = avail_qty + 1;
                }
            }

            return Math.floor(avail_qty / mm_deal.qty); 
        }
        function form_deal(ds_extract_lst,mm_deal,tax_rate){
            var num_deal = _get_total_deal_count_that_can_be_form(ds_extract_lst,mm_deal);
            if(num_deal == 0){ return ;}


            /*
                When we record sale record, it is convenient to record the $ discount amount for each item. To calculate what is the unit discount for EACH item from mm deal,
                    we need to calculate the regular price of the WHOLE deal which depend on the actual the mix_match formation and its corresponding regular price. My point here
                    is that each item that form a mix_match deal have to contain the actual of the whole deal formation for unit_discount calculation. For that reason, we will form a 
                    convenient list of FORMATION items, each FORMATION containing a list of all actual ds formation that is available to form a deal. After the convenient list of 
                    FORMATION is created, we then can assign to each ds_lst a FORMATION item so each ds_item can contain the information of the whole deal Formation for that ds to calculate
                    the unit discount
            */
            var formation_lst = [];//a list of item X. Each X containing a list of available ds to form a deal
            var cur_formation = null;
            var cur_qty_for_cur_deal = 0;//a temporary var to help forming formation_lst
            
            for(var i = 0;i<ds_extract_lst.length;i++){
                
                //init cur_formation if nessesary
                if(cur_qty_for_cur_deal == 0){
                    cur_formation = new Array();
                }

                //forming cur_formation
                var cur_ds = ds_extract_lst[i];
                if(is_ds_available_for_deal(cur_ds,mm_deal)){
                    cur_formation.push(cur_ds);
                    cur_qty_for_cur_deal +=1;
                }

                //when we reach the qty to form a deal, we finalize cur_formation
                if(cur_qty_for_cur_deal == mm_deal.qty){
                    cur_qty_for_cur_deal = 0;
                    formation_lst.push(cur_formation);
                }
            }

            /*
                After that, we will go through each available ds and assign corresponding formation to it so that each available ds will be aware of the whole deal.
            */
            for(var i = 0;i<formation_lst.length;i++){
                var cur_formation = formation_lst[i];

                for(var j=0;j<cur_formation.length;j++){
                    var cur_ds = cur_formation[j];
                    var formation_copy = angular.copy(cur_formation);//make a copy to preven circular reference
                    cur_ds.mm_deal_info = new Mix_match_deal_info(mm_deal,formation_copy,tax_rate);
                }
            }        
        }      

        function search_sp_base_on_ps_lst(ps_lst,suggest_sp_lst){
            var defer = $q.defer();
            var promise_lst = [];

            for(var i=0;i<ps_lst.length;i++){
                var cur_ps = ps_lst[i];
                if(cur_ps.sp_doc_id !== null){
                    var existed_sp = misc_service.get_item_from_lst_base_on_property('sp_doc_id'/*property*/,cur_ps.sp_doc_id/*value*/,suggest_sp_lst);
                    if(existed_sp===null){
                        promise_lst.push(search_sp_offline.by_sp_doc_id(cur_ps.sp_doc_id));
                    }                    
                }
            }
 
            $q.all(promise_lst).then(
                 function(missing_sp_lst){ 
                    var distinct_sp_lst = [];
                    for(var i = 0;i<ps_lst.length;i++){
                        var cur_ps = ps_lst[i];
                        if(cur_ps.sp_doc_id !== null){
                            //make sure the return distinct_sp_lst is distinct
                            var temp_sp = misc_service.get_item_from_lst_base_on_property('sp_doc_id'/*property*/,cur_ps.sp_doc_id/*value*/,distinct_sp_lst);
                            if(temp_sp === null){
                                //sp can either be found on suggest_sp_lst or missing_sp_lst
                                temp_sp = misc_service.get_item_from_lst_base_on_property('sp_doc_id'/*property*/,cur_ps.sp_doc_id/*value*/,suggest_sp_lst);
                                if(temp_sp === null){
                                    temp_sp = misc_service.get_item_from_lst_base_on_property('sp_doc_id'/*property*/,cur_ps.sp_doc_id/*value*/,missing_sp_lst);
                                }
                                distinct_sp_lst.push(temp_sp);
                            }
                        }
                    }
                    defer.resolve(distinct_sp_lst); 
                }
                ,function(reason){ defer.reject(reason); }
            )            
            return defer.promise;   
        }        

        function _assign_possible_deal_to_ds_lst_4_suggestion(ds_lst,mm_lst){
            for(var i = 0;i<ds_lst.length;i++){
                var ds = ds_lst[i];
                if(ds.is_non_inventory()){
                    continue;
                }
                if(ds.store_product.product_id===null || ds.store_product.product_id===undefined){
                    continue;
                }
                ds.possible_deal_lst = _get_posible_deal_from_pid(ds.store_product.product_id,mm_lst);
            }
        }
        //------------------------------------------------    

        return function(ps_lst,suggest_sp_lst){
            /*
                suggest_sp_lst: this is some (possibly not all or none) the distinct sp we need from the provided ps_lst so that we don't need spend time to search for all sp from ps_lst. 
                    . In case of pos page perform an appending_scan, this suggest_sp_lst will be missing for the sp that we most recently appended.
                    . In case of remove ds, this suggest_sp_lst could contain more sp that the ps_lst
                    when call from refresh_ds from the scan page, we have this suggest_sp_lst ready.
                    when call from hold feature, we don't have this suggest_sp_lst in hand. this is why this suggest_sp_lst param is optional. 
            */
            var all_mm_lst = angular.copy($rootScope.GLOBAL_SETTING.mix_match_lst);
            var mm_lst = all_mm_lst.filter(function(mm){return !mm.is_disable;})
            var tax_rate = $rootScope.GLOBAL_SETTING.tax_rate;
            mm_lst.sort(function(a,b){
                return b.qty - a.qty;
            })

            var defer = $q.defer();

            search_sp_base_on_ps_lst(ps_lst,suggest_sp_lst).then(
                 function(sp_distinct_lst){
                    var possible_mm_lst = get_posible_deal_from_sp_lst(sp_distinct_lst,mm_lst);
                    var ds_extract_lst = form_ds_extract(ps_lst,sp_distinct_lst);

                    for(var i = 0;i<possible_mm_lst.length;i++){
                        form_deal(ds_extract_lst,possible_mm_lst[i],tax_rate);
                    }            
                    var compress_ds_lst = compress_ds_lst_function(ds_extract_lst,true/*is_consider_mm_deal*/);
                    _assign_possible_deal_to_ds_lst_4_suggestion(compress_ds_lst,possible_mm_lst)
                    defer.resolve(compress_ds_lst)
                }
                ,function(reason){defer.reject(reason)}
            )

            return defer.promise;
        }
    }])
})