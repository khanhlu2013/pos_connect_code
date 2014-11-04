define(
[
    'angular'
    //
    ,'app/sp_ll_app/service/search/name_sku_online_dlg'
    ,'service/ui'
    ,'app/group_app/service/search_dlg'
    ,'app/group_app/service/api'
]
,function
(
    angular
)
{
    var mod = angular.module('mix_match_app/service/prompt',
    [
         'sp_ll_app/service/search/name_sku_online_dlg'
        ,'service/ui'
        ,'group_app/service/search_dlg'
        ,'group_app/service/api'
    ]);

    mod.factory('mix_match_app/service/prompt',
    [
         '$modal'
        ,'service/ui/alert'
        ,'sp_ll_app/service/search/name_sku_online_dlg/multiple'
        ,'group_app/service/search_dlg/multiple'
        ,'group_app/service/api'
    ,function(
         $modal
        ,alert_service
        ,search_multiple_sp_service
        ,search_multiple_group_service
        ,group_api
    ){
        return function(original_mm){
            var template = 
                '<div class="modal-header">' +
                    '<h3>{{$scope.original_mm == null ? "create new mix match" : "edit " + mm.name}}</h3>' +
                '</div>' +
                '<div class="modal-body">' +            
                    '<form name="form" class="form-horizontal" novalidate>' +
                        '<div class="form-group">' +
                            '<label class="col-sm-4">name</label>' +
                            '<div class="col-sm-8">' +
                                '<input id="mix_match_app/service/prompt/name_txt" ng-model="$parent.mm.name" name="name" required>' +
                                '<label ng-show="form.name.$error.required" class="error">required</label>' +
                            '</div>' +
                        '</div>' +

                        '<div class="form-group">' +
                            '<label class="col-sm-4">qty</label>' +
                            '<div class="col-sm-8">' +
                                '<input' +
                                    ' id="mix_match_app/service/prompt/qty_txt"' +
                                    ' ng-model="$parent.mm.qty"' +
                                    ' name="qty"' +
                                    ' ng-pattern="integer_validation"' +
                                    ' type="number"' +
                                    ' min="2"' +
                                    ' required>' +
                                '<label ng-show="form.qty.$error.required && !form.qty.$error.number && !form.qty.$error.min" class="error">required</label>' +
                                '<label ng-show="form.qty.$error.number || form.qty.$error.pattern" class="error">invalid number</label>' +
                                '<label ng-show="form.qty.$error.min" class="error">at least 2</label>' +
                            '</div>' +
                        '</div>' +

                        '<div class="form-group">' +
                            '<label class="col-sm-4">price</label>' +
                            '<div class="col-sm-8">' +
                                '<input id="mix_match_app/service/prompt/price_txt" ng-model="$parent.mm.mm_price" name="price" type="number" min="0.01" required>' +
                                '<label ng-show="form.price.$error.required && !form.price.$error.number && !form.price.$error.min" class="error">required</label>' +
                                '<label ng-show="form.price.$error.number" class="error">invalid number</label>' +
                                '<label ng-show="form.price.$error.min" class="error">invalid price</label>' +
                            '</div>' +
                        '</div>' +

                        '<div class="form-group">' +
                            '<label class="col-sm-4">include crv&tax</label>' +
                            '<div class="col-sm-8">' +
                                '<input id="mix_match_app/service/prompt/is_include_crv_tax_check" ng-model="$parent.mm.is_include_crv_tax" name="is_include_crv_tax" type="checkbox">' +
                                '<label ng-show="form.is_include_crv_tax.$error.required" class="error">required</label>' +
                            '</div>' +
                        '</div>' +

                        '<div class="form-group">' +
                            '<label class="col-sm-4">disable</label>' +
                            '<div class="col-sm-8">' +
                                '<input id="mix_match_app/service/prompt/is_disable_check" ng-model="$parent.mm.is_disable" type="checkbox">' +
                                '<label ng-show="form.is_disable.$error.required" class="error">required</label>' +
                            '</div>' +
                        '</div>' +                        
                    '</form>' +

                    '<button id="mix_match_app/service/prompt/add_sp_btn" ng-click="add_product()" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> product</button>' +
                    '<button id="mix_match_app/service/prompt/add_group_btn" ng-click="add_group()" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> group</button>' +
                    '<table ng-hide="mm.sp_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
                        '<tr>' +    
                            '<th>product</th>' +
                            '<th>remove</th>' +
                        '<tr>' +
                        '<tr ng-repeat="sp in mm.sp_lst | orderBy : \'name\'">' +
                            '<td>{{sp.name}}</td>' +
                            '<td class="alncenter"><button ng-click="remove_child(sp)" class="btn btn-danger glyphicon glyphicon-trash"></button></td>' +
                        '</tr>' +
                    '</table>' +
                    '<label ng-show="mm.sp_lst.length==0" class="error">empty deal</label>' +
                '</div>' +

                '<div class="modal-footer">' +
                    '<button id="mix_match_app/service/prompt/cancel_btn" ng-click="cancel()" class="btn btn-warning">cancel</button>' +
                    '<button ng-disabled="is_unchange()" ng-click="reset()" class="btn btn-primary">reset</button>' +
                    '<button id="mix_match_app/service/prompt/ok_btn" ng-disabled="is_unchange() || (form.$invalid || mm.sp_lst.length == 0)" ng-click="ok()"class="btn btn-success">ok</button>' +
                '</div>'                        
            ;
            var ModalCtrl = function($scope,$modalInstance,$filter,$q,original_mm){
                $scope.original_mm = original_mm;
                $scope.mm = angular.copy(original_mm);
                $scope.integer_validation = /^\d*$/;
                initial_mm = {is_include_crv_tax:false,is_disable:false,sp_lst:[]};

                if($scope.mm == null){
                    $scope.mm = angular.copy(initial_mm);
                }
                $scope.remove_child = function(sp){
                    for(var i = 0;i<$scope.mm.sp_lst.length;i++){
                        if(sp.id==$scope.mm.sp_lst[i].id){
                            $scope.mm.sp_lst.splice(i,1);
                            break;
                        }
                    }
                }
                function _add_sp_lst_2_deal(sp_lst){
                    for(var i = 0;i<sp_lst.length;i++){

                        var is_found = false//see if we can find sp_lst[i] in the current deal
                        for(var j = 0;j<$scope.mm.sp_lst.length;j++){
                            if($scope.mm.sp_lst[j].id == sp_lst[i].id){
                                is_found = true;
                                break;
                            }
                        }

                        if(!is_found){
                            $scope.mm.sp_lst.push(sp_lst[i]);
                        }
                    }                    
                }
                $scope.add_group = function(){
                    search_multiple_group_service().then(
                        function(group_lst){
                            //the return group list does not contain sp, we need to fetch sp from the server
                            var promise_lst = [];
                            for(var i = 0;i<group_lst.length;i++){
                                promise_lst.push(group_api.get_item(group_lst[i].id));
                            }
                            $q.all(promise_lst).then(
                                function(sp_group_lst){
                                    for(var i = 0;i<sp_group_lst.length;i++){
                                        _add_sp_lst_2_deal(sp_group_lst[i].sp_lst);
                                    }
                                }
                            )
                        }
                        ,function(reason){
                            alert_service(reason);
                        }
                    )
                }
                $scope.add_product = function(){
                    var promise = search_multiple_sp_service(null);
                    promise.then(
                        function(sp_lst){
                            _add_sp_lst_2_deal(sp_lst);
                        },
                        function(reason){
                            alert_service(reason);
                        }
                    )
                }
                $scope.is_unchange = function(){
                    if(original_mm == null){
                        return angular.equals(initial_mm,$scope.mm)
                    }else{
                        return angular.equals(original_mm,$scope.mm)
                    }
                }
                $scope.reset = function(){
                    if(original_mm == null){
                        angular.copy(initial_mm,$scope.mm)
                    }else{
                        angular.copy(original_mm,$scope.mm)
                    }
                }
                $scope.ok = function(){
                    $modalInstance.close($scope.mm);
                }
                $scope.cancel = function(){
                    $modalInstance.dismiss('_cancel_');
                }
            }
            ModalCtrl.$inject = ['$scope','$modalInstance','$filter','$q','original_mm'];                   
            var dlg = $modal.open({
                template:template,
                controller:ModalCtrl,
                size:'lg',
                resolve:{
                    original_mm : function(){return original_mm;}
                }
            })
            return dlg.result;
        }
    }]);
})