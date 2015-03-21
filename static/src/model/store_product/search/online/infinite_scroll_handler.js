/*
    This helper is there to implement dry for 3 places that need the same code:
        . product_app.html -> name_search -> infinite_scroll
        . sp.search.online.multiple -> name_sku_search -> infinite_scroll
        . sp.search.online.single -> name_sku_search -> infinite_scroll

    PRE
        . the scope param must define infinite_scroll_reach_the_end flag. (so outside of this service can reset it to false)
            We could have define this flag inside this
            util (the same way we did for scope.infinite_scroll_busy flag)but decide not to. WHY? The reason we define scope.infinite_scroll_busy 
            inside this util because this util always unset this flag when it is exit to make busy flag = false. This mean when we call this function again,
            busy flag have a CHANCE to be false and proceed through the function call. For scope.infinite_scroll_reach_the_end, this util may exit and the flag of 
            reach_the_end is true. if we don't unset this somewhere outside this util for this flag(when we search another string), this util will never be able 
            to go through when it is called again.

        . the scope param must define is_blur_infinite_scroll_triggerer_textbox:
            there will be a textbox that when we search and hit enter it will load the result's first page. 
            Notice that this text box is still in focus. When we scroll to the end of the page, infinite-scroll 
            trigger an ajax call to the server which call block-ui to block the page. after the ajax is done, 
            block-ui will refocus the element which is the text box on top of the page that cause scrolling
            to lost the position. For this reason, when we load the first page (this is the code that sit outside infinite-scroll handler) lets blur the focus of this 
            element so when we scroll down to trigger ajax and block-ui, block-ui will not queue restore-focus element
            that will cause scroll position to be lost. 
*/


var mod = angular.module('model.store_product');
mod.requires.push.apply(mod.requires,['share.ui']);

mod.factory('model.store_product.search.online.infinite_scroll_handler',
[
    '$q',
    'model.store_product.rest_search',
function(
    $q,
    sp_rest_search
){
    return function(scope,search_str,is_name_only_or_name_sku,sp_lst){
        if(scope.infinite_scroll_reach_the_end){
            return $q.when();
        }

        if(scope.infinite_scroll_busy === undefined){
            scope.infinite_scroll_busy = false;
        }else if(scope.infinite_scroll_busy === true){
            return $q.when();
        }

        var defer = $q.defer();
        var after = sp_lst.length;
        scope.infinite_scroll_busy = true;
        var search_func;
        if(is_name_only_or_name_sku){
            search_func = sp_rest_search.by_name
        }else{
            search_func = sp_rest_search.by_name_sku
        }
        search_func(search_str,after).then(
            function(data){
                sp_lst.push.apply(sp_lst,data);
                scope.infinite_scroll_reach_the_end = (data.length === 0);
                scope.infinite_scroll_busy = false;
                defer.resolve();
            }
            ,function(reason){ 
                defer.reject(reason);
            }
        )
        return defer.promise;
    }
}]);