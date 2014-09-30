/*
    . service to display a list of holding pending_scan_lst and allow user to select one. this service then pop hold out of the list and return

    . not until the user try to un-hold an item by clicking a button on this service do we need to take care of holding current pending scan list. For this reason, 
    it is convenient that this service is RESPONSIBLE for holding current pending_scan_list when user try to un-hold an item. 
*/

define(
[
     'angular'
    //--------
    ,'app/sale_app/service/hold/api'
    ,'service/ui'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/hold/get_hold_ui',
    [
         'sale_app/service/hold/api'
        ,'sale_app/service/pending_scan/get_api'
        ,'sale_app/service/pending_scan/set_api'  
        ,'service/ui'                  
    ]);
    mod.factory('sale_app/service/hold/get_hold_ui',
    [
         '$modal'
        ,'$q'
        ,'sale_app/service/hold/api'
        ,'sale_app/service/pending_scan/get_api'
        ,'sale_app/service/pending_scan/set_api'         
        ,'service/ui/alert'  
        ,'service/ui/confirm'    
    ,function(
         $modal
        ,$q 
        ,hold_api
        ,get_ps_lst
        ,set_ps_lst
        ,alert_service
        ,confirm_service
    ){
        return function(){
            var template = 
                '<div class="modal-header"><h3>select hold</h3></div>' +

                '<div class="modal-body">' +
                    '<pre ng-show="hold_lst.length==0">there is nothing on hold</pre>' +
                    '<div ng-hide="hold_lst.length==0">' +
                        '<div class="col-sm-6">' +
                            '<label>hold list</label>' +
                            '<table class="table table-hover table-bordered table-condensed table-striped">' +
                                '<tr>' +
                                    '<th>time</th>' +
                                    '<th>total</th>' +
                                    '<th>select</th>' +
                                '</tr>' +
                                '<tr ng-repeat="hold in hold_lst | orderBy : \'-hold.timestamp\'">' +
                                    '<td>{{hold.timestamp | date : \'M/d h:mm a\'}}</td>' +
                                    '<td>{{hold.get_total(tax_rate)|currency}}</td>' +
                                    '<td class="alncenter"><button ng-click="toogle_cur_hold(hold)" class="btn glyphicon" ng-class="is_selected(hold) ? \'glyphicon-check btn-warning\' : \'glyphicon-unchecked btn-primary\'"></button></td>' +
                                '</tr>' +
                            '</table>' +
                        '</div>' +

                        '<div class="col-sm-6">' +
                            '<label>selected hold</label>' +
                            '<table class="table table-hover table-bordered table-condensed table-striped">' +
                                '<tr>' +
                                    '<th>qty</th>' +
                                    '<th>product</th>' +
                                    '<th>price</th>' +
                                '</tr>' +
                                '<tr ng-repeat="ds in cur_hold.ds_lst">' +
                                    '<td>{{ds.qty}}</td>' +
                                    '<td>{{ds.get_name()}}</td>' +
                                    '<td>{{ds.get_advertise_price()|currency}}</td>' +
                                '</tr>' +
                            '</table>' +              
                        '</div>' +
                    '</div>' +
                    '<div class="clear"></div>' +
                '</div>' +

                '<div class="modal-footer">' +
                    '<button id="sale_app/service/hold/get_hold_ui/ok_btn" ng-disabled="cur_hold==null"class="btn btn-success" ng-click="select(cur_hold)">ok</button>' +  
                    '<button id="sale_app/service/hold/get_hold_ui/cancel_btn" class="btn btn-warning" ng-click="cancel()">cancel</button>' +
                '</div>'
            ;
            var controller = function($scope,$modalInstance,$rootScope,hold_lst){
                $scope.tax_rate = $rootScope.GLOBAL_SETTING.tax_rate;
                $scope.hold_lst = hold_lst;
                $scope.cur_hold = null;

                $scope.toogle_cur_hold = function(hold){
                    if($scope.is_selected(hold)){ $scope.cur_hold = null; }
                    else{ $scope.cur_hold = hold; }
                }
                $scope.is_selected = function(hold){
                    return $scope.cur_hold == hold;
                }
                function exe_select(hold){
                    var select_index = null;
                    for(var i = 0;i<$scope.hold_lst.length;i++){
                        if($scope.hold_lst[i] == hold){
                            select_index = i;
                            break;
                        }
                    }
                    if(select_index == null){
                        alert_service('alert','bug: can not find index','red');
                        return;
                    }
                    $scope.hold_lst.splice(select_index,1);
                    hold_api.set($scope.hold_lst);
                    hold_api.hold_current_pending_scan_lst();
                    $modalInstance.close(hold);
                }
                $scope.select = function(hold){
                    //before we exe_select, if there are pending scan, we need to confirm with the user that we need to put it on hold.
                    if(get_ps_lst().length != 0){ 
                        confirm_service('we need to hold current scan. continue?','orange').then( function(){ exe_select(hold); } );
                    }
                    else{ exe_select(hold); }
                }
                $scope.cancel = function(){ $modalInstance.dismiss('_cancel_');}
            }
            var dlg = $modal.open({
                 template : template
                ,controller : controller
                ,size : 'lg'
                ,resolve:{ hold_lst:function(){return hold_api.get();} }
            })
            return dlg.result;

        }
    }])
})