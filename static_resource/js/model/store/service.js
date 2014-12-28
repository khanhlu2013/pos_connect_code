define(
[
     'angular'
    ,'model/store/model'
    ,'model/store/api'
]
,function
(
    angular
)
{
    var mod = angular.module('store/service',
    [
         'store/model'
        ,'store/api'
    ]);

    mod.factory('store/service/edit',
    [
         '$q'
        ,'$rootScope'
        ,'store/service/prompt'
        ,'store/model/Store'
        ,'store/api'
    ,function(
         $q
        ,$rootScope
        ,prompt_service
        ,Store
        ,store_api
    ){
        return function(){
            var defer = $q.defer();
            var store = $rootScope.GLOBAL_SETTING.STORE
            prompt_service(store).then(
                function(prompt_data){
                    store_api.edit(prompt_data).then(
                        function(response){
                            $rootScope.GLOBAL_SETTING.STORE = Store.build(response);
                            defer.resolve(response);
                        },function(reason){
                            defer.reject(reason);
                        }   
                    )
                },function(reason){
                    defer.reject(reason);
                }
            )
            return defer.promise
        }
    }])

    mod.factory('store/service/prompt',[
         '$modal'
    ,function(
        $modal
    ){
        return function(store_ori){

            var template_form =
                '<form name="form" class="form-horizontal" novalidate>' +
                    '<div class="form-group">' +
                        '<label class="col-sm-4">name</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="$parent.store.name" name="name" required>' +
                            '<label ng-show="form.name.$error.required" class="error">required</label>' +
                        '</div>' +
                    '</div>' +
            
                    '<div class="form-group">' +
                        '<label class="col-sm-4">tax_rate</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="$parent.store.tax_rate" name="tax_rate" type="number" min="0.01" required>' +
                            '<label ng-show="form.tax_rate.$error.required && !form.tax_rate.number && !form.tax_rate.$error.min" class="error">required</label>' +
                            '<label ng-show="form.tax_rate.$error.number" class="error">invalid number</label>' +
                            '<label ng-show="form.tax_rate.$error.min" class="error">invalid tax_rate</label>' +
                        '</div>' +
                    '</div>' +

                    '<hr>' + //---------------------------------------------------------------

                    '<div class="form-group">' +
                        '<label class="col-sm-4">phone</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="$parent.store.phone" name="phone">' +
                        '</div>' +
                    '</div>' +

                    '<hr>' + //---------------------------------------------------------------

                    '<div class="form-group">' +
                        '<label class="col-sm-4">display_is_report</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="$parent.store.display_is_report" name="display_is_report" type="checkbox">' +
                            '<label ng-show="form.display_is_report.$error.required" class="error">required</label>' +
                        '</div>' +
                    '</div>' +            

                    '<div class="form-group">' +
                        '<label class="col-sm-4">display_type</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="$parent.store.display_type" name="display_type" type="checkbox">' +
                            '<label ng-show="form.display_type.$error.required" class="error">required</label>' +
                        '</div>' +
                    '</div>' +                                     

                    '<div class="form-group">' +
                        '<label class="col-sm-4">display_tag</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="$parent.store.display_tag" name="display_tag" type="checkbox">' +
                            '<label ng-show="form.display_tag.$error.required" class="error">required</label>' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4">display_group</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="$parent.store.display_group" name="display_group" type="checkbox">' +
                            '<label ng-show="form.display_group.$error.required" class="error">required</label>' +
                        '</div>' +
                    '</div>' +        

                    '<div class="form-group">' +
                        '<label class="col-sm-4">display_deal</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="$parent.store.display_deal" name="display_deal" type="checkbox">' +
                            '<label ng-show="form.display_deal.$error.required" class="error">required</label>' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4">display_vendor</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="$parent.store.display_vendor" name="display_vendor" type="checkbox">' +
                            '<label ng-show="form.display_vendor.$error.required" class="error">required</label>' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4">display_buydown</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="$parent.store.display_buydown" name="display_buydown" type="checkbox">' +
                            '<label ng-show="form.display_buydown.$error.required" class="error">required</label>' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4">display_vc_price</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="$parent.store.display_vc_price" name="display_vc_price" type="checkbox">' +
                            '<label ng-show="form.display_vc_price.$error.required" class="error">required</label>' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4">display_stock</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="$parent.store.display_stock" name="display_stock" type="checkbox">' +
                            '<label ng-show="form.display_stock.$error.required" class="error">required</label>' +
                        '</div>' +
                    '</div>' +

                '</form>'
            ;
            var template =
                '<div class="modal-header"><h3></h3></div>' +
                '<div class="modal-body">' + 
                    template_form +
                '</div>' +
                '<div class="modal-footer">' + 
                    '<button ng-disabled="form.$invalid || is_unchange()" class="btn btn-primary" ng-click="ok()">ok</button>' +
                    '<button ng-disabled="is_unchange()" class="btn btn-success" ng-click="reset()">reset</button>' +
                    '<button class="btn btn-warning" ng-click="cancel()">cancel</button>' +
                '</div>'
            ;
            ModalCtrl = function($scope,$modalInstance,store_ori){
                $scope.ok = function(){
                    $modalInstance.close($scope.store)
                }
                $scope.reset = function(){
                    $scope.store = angular.copy(store_ori)
                }
                $scope.cancel = function(){
                    $modalInstance.dismiss('_cancel_');
                }     
                $scope.is_unchange = function(){
                    return angular.equals($scope.store,store_ori)
                }
                //init code
                $scope.reset();
            }
            ModalCtrl.$inject = ['$scope','$modalInstance','store_ori'];                
            var dlg = $modal.open({
                 template:template
                ,controller:ModalCtrl
                ,size:'md'
                ,resolve:{store_ori:function(){return store_ori}}
            })
            return dlg.result            
        }
    }]);
})

