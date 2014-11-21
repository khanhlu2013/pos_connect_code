define(
[
    'angular'
    //----
    ,'app/sp_app/service/prompt'
    ,'app/sp_app/service/api/sku'
    ,'app/sp_app/service/api/crud'
    ,'app/sp_app/service/suggest'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_app/service/create',
    [
         'sp_app/service/prompt'
        ,'sp_app/service/api/sku'
        ,'sp_app/service/api/crud'
        ,'sp_app/service/suggest'
    ]);

    mod.factory('sp_app/service/create',
        [
            '$modal',
            '$filter',
            '$http',
            '$q',
            // 'sp_app/service/create/select_suggest',
            'sp_app/service/create/new',
            'sp_app/service/create/old',
            'sp_app/service/api/sku',
            'sp_app/service/suggest',
        function(
            $modal,
            $filter,
            $http,
            $q,
            // select_suggest,
            create_new_sp_service,
            create_old_sp_service,
            api_sku,
            new_suggest
        ){
        return function(product_lst,my_sp_lst,sku){

            var select_promise = new_suggest(product_lst,my_sp_lst,sku)
            // var select_promise = select_suggest(product_lst,my_sp_lst,sku)
            var create_promise = select_promise.then(
                function(select_option){
                    if(select_option == null)
                    {
                        return create_new_sp_service(sku);
                    }
                    else if(select_option.constructor.name=='Store_product')
                    {
                        var cur_store_sp = select_option;
                        return api_sku.add_sku(cur_store_sp.product_id,sku);
                    }
                    else if(select_option.constructor.name=='Product')
                    {
                        var suggest_product = select_option;
                        return create_old_sp_service(suggest_product,sku);
                    }
                },
                function(reason){
                    return $q.reject(reason);
                }
            );
            return create_promise;
        }
    }]);

    mod.factory('sp_app/service/create/old',
    [
        '$http',
        '$q',
        'sp_app/service/prompt',
        'sp_app/service/api/sku',
        'sp_app/service/api/crud',
    function(
        $http,
        $q,
        prompt_service,
        api_sku,
        sp_crud_api
    ){
        return function(suggest_product,sku){
            var prompt_promise = prompt_service(null/*original_sp*/,suggest_product,null/*duplicate_sp*/,sku,false/*is_operate_offline*/);
            var insert_promise = prompt_promise.then(
                 function(prompt_data){ return sp_crud_api.insert_old(suggest_product.product_id,sku,prompt_data.sp);}
                ,function(reason){ return $q.reject(reason);}
            )
            return insert_promise;
        }
    }]);

    mod.factory('sp_app/service/create/new',
    [
         '$http'
        ,'$q'
        ,'sp_app/service/prompt'
        ,'sp_app/service/api/crud'
    ,function(
         $http
        ,$q
        ,prompt_service
        ,sp_crud_api
    ){
        return function(sku){
            var prompt_promise = prompt_service(null/*original_sp*/,null/*suggest_product*/,null/*duplicate_sp*/,sku,false/*is_operate_offline*/);
            var insert_promise = prompt_promise.then(
                 function(prompt_data){ return sp_crud_api.insert_new(prompt_data.sp,sku);}
                ,function(reason){ return $q.reject(reason); }
            );
            return insert_promise;
        }
    }]);

    // mod.factory('sp_app/service/create/select_suggest',
    // [
    //      '$modal'
    //     ,'$filter'
    //     ,'$q'
    // ,function(
    //      $modal
    //     ,$filter
    //     ,$q
    // ){
    //     return function(product_lst,my_sp_lst){
    //         /*
    //             PRE: length of 0_0 and 1_0 can be both emtpy
                
    //             RETURN: a promise
    //                 . promise.data = null           -> create new sp
    //                 . promise.data = sp             -> add sku
    //                 . promise.data = product        -> insert old sp

    //         */

    //         if(product_lst.length == 0 && my_sp_lst.length == 0){
    //             var defer = $q.defer();
    //             defer.resolve(null);
    //             return defer.promise;
    //         }

    //         var template =
    //             '<div id="sp_app/service/create/select_suggestion/dialog">' +
    //                 '<div class="modal-header">' +
    //                     '<h3 class="modal-title">select option</h3>' +
    //                 '</div>' +      
    //                 '<div class="modal-body">' +
    //                     '<div ng-hide="my_sp_lst.length == 0">' +
    //                         '<pre>product exist in your store. just need to add sku</pre>' +
    //                         '<table class="table table-hover table-bordered table-condensed table-striped">' + 
    //                             '<tr>' +
    //                                 '<caption>product exist in your store already. select to only add sku.</caption>' +
    //                                 '<th>your product</th>' +
    //                                 '<th>price</th>' +
    //                                 '<th>taxable</th>' +
    //                                 '<th>crv</th>' +
    //                                 '<th>cost</th>' +
    //                                 '<th>buydown</th>' +
    //                                 '<th><span class="glyphicon glyphicon-plus"> sku</span></th>' +
    //                             '</tr>' +
    //                             '<tr ng-repeat="sp in my_sp_lst">' +
    //                                 '<td>{{sp.name}}</td>' +
    //                                 '<td>{{sp.price | currency}}</td>' +
    //                                 '<td ng-class="sp.is_taxable ? \'glyphicon glyphicon-ok\' : \'glyphicon glyphicon-remove\'"></td>' +
    //                                 '<td>{{sp.get_crv()}}</td>' +
    //                                 '<td>{{sp.get_cost()}}</td>' +
    //                                 '<td>{{sp.get_buydown()}}</td>' +
    //                                 '<td><button ng-click="add_sku(sp)" class="btn btn-primary glyphicon glyphicon-plus"> sku</button></td>' +
    //                             '</tr>' +
    //                         '</table>' +    
    //                     '</div>' +      
    //                     '<div ng-hide="product_lst.length == 0">' +
    //                         '<table class="table table-hover table-bordered table-condensed table-striped">' + 
    //                             '<tr>' +
    //                                 '<th>product from other stores</th>' +
    //                                 '<th>import to my store</th>' +
    //                             '</tr>' +
    //                             '<tr ng-repeat="product in product_lst">' +
    //                                 '<td>{{product.name}}</td>' +
    //                                 '<td><button ng-click="import(product)" class="btn btn-primary">import</button></td>' +
    //                             '</tr>' +                           
    //                         '</table>' +
    //                     '</div>' +                                              
    //                     '<br />' +
    //                     '<button class="btn btn-primary" ng-click="create_new()">if product is not show in list, click here to create new</button>' +

    //                 '</div>' +  
    //                 '<div class="modal-footer">' +
    //                     '<button id="sp_app/service/create/select_suggest/cancel_btn" class="btn btn-warning" ng-click="cancel()">cancel</button>' +
    //                 '</div>' +                                                      
    //             '</div>'
    //         ;

    //         var ModalCtrl = function($scope,$modalInstance,product_lst,my_sp_lst){
    //             $scope.product_lst = product_lst;
    //             $scope.my_sp_lst = my_sp_lst;

    //             $scope.add_sku = function(sp){
    //                 $modalInstance.close(sp);
    //             }
    //             $scope.import = function(product){
    //                 $modalInstance.close(product);
    //             }
    //             $scope.create_new = function(){
    //                 $modalInstance.close(null);
    //             }
    //             $scope.cancel = function(){
    //                 $modalInstance.dismiss('_cancel_');
    //             }
    //         };
    //         ModalCtrl.$inject = ['$scope','$modalInstance','product_lst','my_sp_lst'];
    //         var dlg = $modal.open({
    //             template:template,
    //             controller:ModalCtrl,
    //             size:'lg',
    //             resolve: {
    //                 product_lst : function(){return product_lst;},
    //                 my_sp_lst : function(){return my_sp_lst;}
    //             }
    //         }); 

    //         return dlg.result;
    //     }
    // }]);
})