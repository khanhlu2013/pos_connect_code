define(
[
     'angular'
    //--------
    ,'app/payment_type_app/model'
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
        return function(sale_able_lst,prefill_tender_ln_lst,tax_rate){
            var template = 
            '<form name="form" novalidate role="form">' +
                '<div class="modal-header"><h3 id="sale_app/service/tender_ui/due_lbl">due: {{get_due()|currency}}</h3></div>' +
                '<div class="modal-body">' +
                    // '<form name="form" novalidate role="form">' +
                        '<div class="form-horizontal" >' +
                            '<div ng-repeat="pt_tender in pt_lst | orderBy:\'sort\'" class="form-group">' +
                                '<ng-form name="inner_form">' +
                                    '<label ng-attr-id="{{\'sale_app/service/tender_ui/pt_lbl/\' + pt_tender.id}}" class="col-sm-4 control-label input-lg" >{{pt_tender.name}}:</label>' +
                                    '<div class="col-sm-8">' +
                                        '<input' +
                                            ' ng-attr-id="{{\'sale_app/service/tender_ui/pt_txt/\' + pt_tender.id}}" ' +
                                            ' name="a_pt"' +
                                            ' ng-model="temp_tender_ln_dic[pt_tender.id]"' +
                                            ' type="number"' +
                                            ' min="0.01"' +
                                            ' class="input-lg"' +
                                            ' focus-me="{{pt_tender.id===null}}"' +
                                            ' onClick="this.select();"' +
                                        '>' +
                                        '<label ng-show="inner_form.a_pt.$error.number" class="error">invalid number</label>' +
                                        '<label ng-show="inner_form.a_pt.$error.min" class="error">invalid amount</label>' +                                        
                                    '</div>' +
                                '</ng-form>' +
                            '</div>' +
                        '</div>' + /* end form horizontal*/
                    // '</form>' + /* end modal body*/             
                '</div>' +
                
                '<div class="modal-footer">' + 
                    '<button' +
                        ' id="sale_app/service/tender_ui/ok_btn"' +
                        ' ng-disabled="get_change() < 0.0 || form.$invalid"' +
                        ' ng-click="ok()"' +
                        ' class="btn btn-lg btn-success"' +
                        ' type="submit"' +
                        ' modal-enter="ok()">' +
                            'change: {{get_change()|currency}}' +
                    '</button>' +
                    '<button id="sale_app/service/tender_ui/cancel_btn" ng-click="cancel()" class="btn btn-lg btn-warning" type="button">cancel</button>' +
                '</div>' +
            '</form>'
            ;
            var ModalCtrl = function($scope,$modalInstance,sale_able_lst,prefill_tender_ln_lst,tax_rate){
                $scope.get_due = function(){
                    var due = 0.0;
                    for(var i = 0;i<$scope.sale_able_lst.length;i++){
                        due += $scope.sale_able_lst[i].get_line_total(tax_rate);
                    }      
                    return misc_service.round_float_2_decimal(due);              
                }
                $scope.get_change = function(){
                    var tender_amount = 0.0;
                    for (var pt_id in $scope.temp_tender_ln_dic) {
                        if ($scope.temp_tender_ln_dic.hasOwnProperty(pt_id)) {
                            tender_amount += $scope.temp_tender_ln_dic[pt_id];
                        }
                    }                    
                    var due = $scope.get_due();
                    return tender_amount - due;
                }
                $scope.ok = function(){ 
                    var tender_ln_lst = [];

                    for (var pt_id in $scope.temp_tender_ln_dic) {
                        if ($scope.temp_tender_ln_dic.hasOwnProperty(pt_id)) {
                            var amount = $scope.temp_tender_ln_dic[pt_id];
                            if(amount !== null){
                                //when we remove the existing amount, it could be null
                                var pt = null;var name = null;
                                if(pt_id!=='null'){
                                    pt_id = parseInt(pt_id);
                                    pt = misc_service.get_item_from_lst_base_on_id(pt_id,$scope.pt_lst);
                                    name = pt.name;
                                }
                                tender_ln_lst.push(new Tender_ln(null/*id*/,pt,$scope.temp_tender_ln_dic[pt_id]/*amount*/,name));
                            }
                        }
                    }                          
                    $modalInstance.close(tender_ln_lst); 
                }
                function activate_disable_pt(pt_lst,prefill_tender_ln_lst){
                    /*
                        pt_lst could contain disable items. but if these disable items in pt_lst exist in prefill_tender_ln_lst, then we will activate these disable items.
                    */
                    for(var i = 0;i<pt_lst.length;i++){
                        var cur_pt = pt_lst[i];
                        if(cur_pt.active === false){
                            var tender_ln_lst = prefill_tender_ln_lst.filter(function(item){
                                if(item.pt === null/*cash tender ln*/){
                                    return false;
                                }else{
                                    return item.pt.id === cur_pt.id;
                                }

                            });
                            if(tender_ln_lst.length === 1){
                                cur_pt.active = true;
                            }
                        }
                    }
                }
                $scope.cancel = function(){ $modalInstance.dismiss('_cancel_'); }
                $scope.pt_lst = angular.copy($rootScope.GLOBAL_SETTING.payment_type_lst);
                var cash_pt = new Payment_type(null,'cash','___'/*sort*/,true/*active*/);
                $scope.pt_lst.unshift(cash_pt);
                $scope.sale_able_lst = sale_able_lst;
                $scope.temp_tender_ln_dic = {};
                if(prefill_tender_ln_lst !== null && prefill_tender_ln_lst !== undefined){
                    activate_disable_pt($scope.pt_lst,prefill_tender_ln_lst);
                    for(var i = 0;i<prefill_tender_ln_lst.length ;i++){
                        var cur_tender_ln = prefill_tender_ln_lst[i];
                        var cur_pt = cur_tender_ln.pt;
                        var cur_pt_id = cur_pt === null ? null : cur_pt.id;
                        $scope.temp_tender_ln_dic[cur_pt_id] = cur_tender_ln.amount;
                    }
                }else{
                    $scope.temp_tender_ln_dic['null'] = $scope.get_due();  
                }           
                $scope.pt_lst = $scope.pt_lst.filter(function(pt){return pt.active});     
            }
            ModalCtrl.$inject = ['$scope','$modalInstance','sale_able_lst','prefill_tender_ln_lst','tax_rate'];           
            var dlg = $modal.open({
                 template:template
                ,controller:ModalCtrl
                ,size:'lg'
                ,resolve : 
                    {
                        sale_able_lst:function(){
                            return sale_able_lst;
                        }
                        ,prefill_tender_ln_lst:function(){
                            return prefill_tender_ln_lst
                        }
                        ,tax_rate:function(){
                            return tax_rate;
                        }
                    }
            })

            return dlg.result;
        }
    }])
})