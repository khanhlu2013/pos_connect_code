var mod = angular.module('model.store_product');

mod.factory('model.store_product.type_tag_util',
[
    '$rootScope',
    '$q',
    'model.store_product.rest_type_tag',
function(
    $rootScope,
    $q,
    rest_type_tag
){
    var TYPE_TAG_CACHE_LST = undefined;
    var get_tag_lst = function(type_tag_lst,type){
        var result = [];
        for(var i = 0;i<type_tag_lst.length;i++){
            var cur_type_tag = type_tag_lst[i];
            if(cur_type_tag.p_type === type){
                result.push(cur_type_tag.p_tag); 
            }
        }
        return result;
    }    
    var get_type_lst = function(type_tag_lst){
        var result = [];
        for(var i = 0;i<type_tag_lst.length;i++){
            var type_tag = type_tag_lst[i];
            if(result.indexOf(type_tag.p_type) === -1){
                result.push(type_tag.p_type);
            }
        }
        return result;        
    }
    var get_cache = function(){
        return TYPE_TAG_CACHE_LST;
    }
    var get = function(){
        if(TYPE_TAG_CACHE_LST === undefined){
            return rest_type_tag();
        }else{
            return $q.when(TYPE_TAG_CACHE_LST);
        }
    }  
    var _update_lst = function(){
        var type_lst = get_type_lst(TYPE_TAG_CACHE_LST);
        if(type_lst.indexOf(type_tag_obj.p_type) === -1){
            TYPE_TAG_CACHE_LST.push(type_tag_obj);
        }else{
            var tag_lst = get_tag_lst(TYPE_TAG_CACHE_LST,type_tag_obj.p_type);
            if(tag_lst.indexOf(type_tag_obj.p_tag)=== -1){
                TYPE_TAG_CACHE_LST.push(type_tag_obj);
            }
        }        
    }
    $rootScope.$on('type_tag_downloaded_from_server',function(event,type_tag_lst){
        TYPE_TAG_CACHE_LST = type_tag_lst;
    });
    $rootScope.$on('type_tag_uploaded_to_server',function(event,type_tag_obj){
        if(TYPE_TAG_CACHE_LST === undefined){
            return;
        }
        
        var type_lst = get_type_lst(TYPE_TAG_CACHE_LST);
        if(type_lst.indexOf(type_tag_obj.p_type) === -1){
            TYPE_TAG_CACHE_LST.push(type_tag_obj);
        }else{
            var tag_lst = get_tag_lst(TYPE_TAG_CACHE_LST,type_tag_obj.p_type);
            if(tag_lst.indexOf(type_tag_obj.p_tag)=== -1){
                TYPE_TAG_CACHE_LST.push(type_tag_obj);
            }
        }
    });
  
    return{
        get_type_lst : get_type_lst,
        get_tag_lst : get_tag_lst,
        get_cache : get_cache,
        get : get
    }
}])