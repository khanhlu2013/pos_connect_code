define(
[
     'angular'
    //--------
    ,'app/payment_type_app/model/Payment_type'
    ,'app/receipt_app/model'
    ,'service/misc'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/tender_ui',
    [
         'payment_type_app/model'
        ,'receipt_app/model'
        ,'service/misc'
    ]);
    mod.factory('sale_app/service/tender_ui',
    [
         '$modal'
        ,'$rootScope'
        ,'payment_type_app/model/Payment_type'
        ,'receipt_app/model/Tender_ln'
        ,'service/misc'
    ,function(
         $modal
        ,$rootScope
        ,Payment_type
        ,Tender_ln
        ,misc_service
    ){
        return function(ds_lst){
            var template = 
                '<div class="modal-header"><h3>payment</h3></div>' +
                '<div class="modal-body">' +
                    '<form name="form" novalidate role="form">' +
                        '<div class="form-horizontal" >' +
                            '<div ng-repeat="pt in pt_lst | orderBy : \'name\'" class="form-group">' +
                                '<ng-form name="inner_form">' +
                                    '<label class="col-sm-4 control-label" >{{pt.name}}:</label>' +
                                    '<div class="col-sm-8">' +
                                        '<input ng-attr-id="{{\'sale_app/service/tender_ui/pt_txt/\' + pt.id}}"  name="a_pt" ng-model="temp_tender_ln_dic[pt.id]" type="number" min="0.01">' +
                                        '<label ng-show="inner_form.a_pt.$error.number" class="error">invalid number</label>' +
                                        '<label ng-show="inner_form.a_pt.$error.min" class="error">invalid amount</label>' +                                        
                                    '</div>' +
                                '</ng-form>' +
                            '</div>' +
                        '</div>' + /* end form horizontal*/
                    '</form>' + /* end modal body*/             
                '</div>' +
                
                '<div class="modal-footer">' + 
                    '<button id="sale_app/service/tender_ui/ok_btn" ng-disabled="get_change() < 0.0 || form.$invalid" ng-click="ok()" class="btn btn-success">{{get_change()|currency}}</button>' +
                    '<button id="sale_app/service/tender_ui/cancel_btn" ng-click="cancel()" class="btn btn-warning">cancel</button>' +
                '</div>'
            ;
            var controller = function($scope,$modalInstance,ds_lst){
                $scope.pt_lst = angular.copy($rootScope.GLOBAL_SETTING.payment_type_lst);
                var cash_pt = new Payment_type(null,'cash');
                $scope.pt_lst.push(cash_pt);
                $scope.ds_lst = ds_lst;
                $scope.temp_tender_ln_dic = {};

                $scope.get_change = function(){
                    var tender_amount = 0.0;
                    for (var pt_id in $scope.temp_tender_ln_dic) {
                        if ($scope.temp_tender_ln_dic.hasOwnProperty(pt_id)) {
                            tender_amount += $scope.temp_tender_ln_dic[pt_id];
                        }
                    }                    
                    var total_line = 0.0;
                    for(var i = 0;i<ds_lst.length;i++){
                        total_line += ds_lst[i].get_line_total($rootScope.GLOBAL_SETTING.tax_rate);
                    }
                    return tender_amount - total_line;
                }
                $scope.ok = function(){ 
                    var tender_ln_lst = [];

                    for (var pt_id in $scope.temp_tender_ln_dic) {
                        if ($scope.temp_tender_ln_dic.hasOwnProperty(pt_id)) {
                            var pt_name = null;
                            if(pt_id!=='null'){
                                pt_id = parseInt(pt_id);
                                var pt = misc_service.get_item_from_lst_base_on_id(pt_id,$scope.pt_lst);
                                pt_name = pt.name;
                            }else{
                                pt_id = null;
                            }
                            tender_ln_lst.push(new Tender_ln(pt_id/*id*/,$scope.temp_tender_ln_dic[pt_id]/*amount*/,pt_name));
                        }
                    }                          
                    $modalInstance.close(tender_ln_lst); 
                }
                $scope.cancel = function(){ $modalInstance.dismiss('_cancel_'); }
            }
            var dlg = $modal.open({
                 template:template
                ,controller:controller
                ,size:'lg'
                ,resolve : {ds_lst:function(){return ds_lst;}}
            })

            return dlg.result;
        }
    }])
})