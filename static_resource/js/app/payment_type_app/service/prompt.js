define(
[
     'angular'
    //--------
    ,'app/payment_type_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('payment_type_app/service/prompt',
    [
        'payment_type_app/model'
    ]);
    mod.factory('payment_type_app/service/prompt',
    [
         '$modal'
        ,'payment_type_app/model/Payment_type'
    ,function(
         $modal
        ,Payment_type
    ){
        return function(original_pt){
            var template = 
                '<div class="modal-header"><h3>payment type</h3></div>' +
                '<div class="modal-body">' + 
                    '<form name="form" novalidate role="form">' +
                        '<div class="form-horizontal" >' +

                            '<div class="form-group">' +
                                '<label class="col-sm-4 control-label" >Name:</label>' +
                                '<div class="col-sm-8">' +
                                    '<input id="payment_type_app/service/prompt/name_txt" name="name" ng-model="$parent.pt.name" type="text" required>' +
                                    '<label class="error" ng-show="form.name.$error.required">require</label>' +
                                '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label class="col-sm-4 control-label" >Sort:</label>' +
                                '<div class="col-sm-8">' +
                                    '<input id="payment_type_app/service/prompt/sort_txt" name="sort" ng-model="$parent.pt.sort" type="text" required>' +
                                    '<label class="error" ng-show="form.sort.$error.required">require</label>' +
                                '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label class="col-sm-4 control-label">Active:</label>' +
                                '<div class="col-sm-8">' +
                                    '<input id="payment_type_app/service/prompt/active_check" ng-model="$parent.pt.active" type="checkbox">' +
                                '</div>' +
                            '</div>' +
                        '</div>' + /* end form horizontal*/
                    '</form>' + /* end modal body*/   
                '</div>' +
                '<div class="modal-footer">' + 
                    '<button id="payment_type_app/service/prompt/ok_btn" ng-disabled="is_unchange()" ng-click="ok()" class="btn btn-success">ok</button>' +
                    '<button ng-disabled="is_unchange()" ng-click="reset()" class="btn btn-primary">reset</button>' +
                    '<button id="payment_type_app/service/prompt/cancel_btn" ng-click="cancel()" class="btn btn-warning">cancel</button>' +
                '</div>' 
            ;
            var controller = function($scope,$modalInstance,original_pt){
                $scope.reset = function(){
                    $scope.pt = (original_pt === null ? angular.copy(blank_pt) : angular.copy(original_pt));     
                }
                $scope.is_unchange = function(){
                    if(original_pt === null)    { return angular.equals($scope.pt,blank_pt); }
                    else                        { return angular.equals($scope.pt,original_pt); }
                }
                $scope.ok = function(){ $modalInstance.close($scope.pt); }
                $scope.cancel = function(){ $modalInstance.dismiss('_cancel_'); }

                var blank_pt = new Payment_type(null/*id*/,null/*name*/,null/*sort*/,true/*is_active*/);
                $scope.reset();                
            }
            var dlg = $modal.open({
                 template:template
                ,controller:controller
                ,size:'md'
                ,resolve:{original_pt:function(){return original_pt}}
            })
            return dlg.result
        }
    }])
})