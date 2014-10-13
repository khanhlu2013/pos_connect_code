define(
[
	'angular'
    //---
    ,'app/sp_app/service/edit/group'
    ,'app/sp_app/service/edit/kit'   
    ,'app/sp_app/service/edit/sku'      
    ,'app/sp_app/service/edit/sp'       
    ,'app/sp_app/service/api/search'
    ,'service/ui'
]
,function
(
	angular
)
{
    var mod = angular.module('sp_app/service/info',
    [
         'sp_app/service/edit/group'
        ,'sp_app/service/edit/kit'
        ,'sp_app/service/edit/sp'
        ,'sp_app/service/edit/sku'
        ,'sp_app/service/api/search'
        ,'service/ui'
    ]);
    
    mod.factory('sp_app/service/info',
    [
         '$modal'
        ,'sp_app/service/edit/group'
        ,'sp_app/service/edit/kit'
        ,'sp_app/service/edit/sp'
        ,'sp_app/service/edit/sku'
        ,'sp_app/service/api/search'
        ,'service/ui/alert'
    ,function (
         $modal
        ,edit_group
        ,edit_kit
        ,edit_sp
        ,edit_sku
        ,search_api
        ,alert_service
    ){
        var template =
            '<div id="sp_app/service/info/dialog" class="modal-header">' +
                '<h3 class="modal-title">Info: {{sp.name}}</h3>' +
            '</div>' +

            '<div class="modal-body">' +
                '<tabset justified="true">' +
                    '<tab id="sp_app/service/info/tab/product" heading="product" select="switch_tab(\'product\')">' +
                        '<div class="form-horizontal" >' +
                            '<div class="form-group">' +
                                '<label class="col-sm-4 control-label">Name:</label>' +
                                '<p class="col-sm-8 form-control-static">{{sp.name}}</p>' +
                            '</div>' +

                            '<div class="form-group">' +                            
                                '<label class="col-sm-4 control-label">Price:</label>' +
                                '<p class="col-sm-8 form-control-static">{{sp.price | currency}}</p>' +
                            '</div>' +

                            '<div class="form-group">' +
                                '<label class="col-sm-4 control-label">Crv:</label>' +
                                '<p class="col-sm-8 form-control-static">{{sp.get_crv()|currency}}</p>' +
                            '</div>' +

                            '<div class="form-group">' +
                                '<label class="col-sm-4 control-label">Taxable:</label>' +
                                '<p class="form-control-static col-sm-8">' +
                                    '<span ng-class="sp.is_taxable ? \'glyphicon glyphicon-ok\' : \'glyphicon glyphicon-remove\'"></span>' +
                                '</p>' +
                            '</div>' +

                            '<div class="form-group">' +
                                '<label class="col-sm-4 control-label">Cost:</label>' +
                                '<p class="col-sm-8 form-control-static">{{sp.get_cost()|currency}}</p>' +
                            '</div>' +

                            '<hr>' +

                            '<div class="form-group">' +
                                '<label class="col-sm-4 control-label">Sale report:</label>' +
                                '<p class="form-control-static col-sm-8">' +
                                    '<span ng-class="sp.is_sale_report ? \'glyphicon glyphicon-ok\' : \'glyphicon glyphicon-remove\'"></span>' +
                                '</p>' +
                            '</div>' +

                            '<div class="form-group">' +
                                '<label class="col-sm-4 control-label">Type:</label>' +
                                '<p class="col-sm-8 form-control-static">{{sp.p_type}}</p>' +
                            '</div>' +

                            '<div class="form-group">' +                            
                                '<label class="col-sm-4 control-label">Tag:</label>' +
                                '<p class="col-sm-8 form-control-static">{{sp.p_tag}}</p>' +
                            '</div>' +

                            '<div class="form-group">' +                                   
                                '<label class="col-sm-4 control-label">Vendor:</label>' +
                                '<p class="col-sm-8 form-control-static">{{sp.vendor}}</p>' +
                            '</div>' +

                            '<div class="form-group">' +                               
                                '<label class="col-sm-4 control-label">Buydown:</label>' +
                                '<p class="col-sm-8 form-control-static">{{sp.get_buydown()|currency}}</p>' +
                            '</div>' +

                            '<div class="form-group">' +                               
                                '<label class="col-sm-4 control-label">Value customer price:</label>' +
                                '<p class="col-sm-8 form-control-static">{{sp.value_customer_price|currency}}</p>' +
                            '</div>' +

                        '</div>' + /* end form horizontal*/
                    '</tab>' +
                    
                    '<tab id="sp_app/service/info/tab/group" heading="group" select="switch_tab(\'group\')">' +
                        '<table ng-hide="sp.group_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
                            '<tr>' +
                                '<th>group</th>' +                
                            '</tr>' +    
                            '<tr ng-repeat="group_info in sp.group_lst">' +
                                '<td>{{group_info.name}}</td>' +                    
                            '</tr>' +                                                  
                        '</table>' +      
                        '<pre ng-show="sp.group_lst.length==0">there is no group</pre>' +         
                    '</tab>' +
                    '<tab id="sp_app/service/info/tab/kit" heading="kit" select="switch_tab(\'kit\')">' +
                        '<table ng-hide="sp.breakdown_assoc_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
                            '<tr>' +
                                '<th>kit</th>' +              
                                '<th>qty</th>' +  
                            '</tr>' +
                            '<tr ng-repeat="assoc_info in sp.breakdown_assoc_lst | orderBy : \'breakdown.name\'">' +
                                '<td>{{assoc_info.breakdown.name}}</td>' +      
                                '<td>{{assoc_info.qty}}</td>' +                                                  
                            '</tr>' +                         
                        '</table>' +  
                        '<pre ng-show="sp.breakdown_assoc_lst.length==0">there is no kit</pre>' +                 
                    '</tab>' +     
                    '<tab id="sp_app/service/info/tab/sku" heading="sku" select="switch_tab(\'sku\')">' +
                        '<table ng-show="sp.get_my_sku_assoc_lst().length != 0" class="table table-hover table-bordered table-condensed table-striped">' +
                            '<tr>' +
                                '<th>sku</th>' +              
                            '</tr>' +
                            '<tr ng-repeat="sku_assoc_info in sp.get_my_sku_assoc_lst() | orderBy:\'sku_str\'">' +
                                '<td>{{sku_assoc_info.sku_str}}</td>' +      
                            '</tr>' +
                        '</table>' +  
                        '<pre ng-show="sp.get_my_sku_assoc_lst().length == 0">there is no sku</pre>' +                 
                    '</tab>' +                                                          
                '</tabset>' +
            '</div>' + /* end modal body*/

            '<div class="modal-footer">' +
                '<button id="sp_app/service/info/edit_btn" class="btn btn-primary btn-float-left" ng-click="edit()">edit {{cur_tab}}</button>' +
                '<button ng-click="duplicate()" ng-show="cur_tab==\'product\'" class="btn btn-primary btn-float-left" ng-click="duplicate()">duplicate</button>' +
                '<button id="sp_app/service/info/exit_btn" class="btn btn-warning" ng-click="exit()">exit</button>' +
            '</div>'
        ;      

        var ModalCtrl = function($scope,$modalInstance,$filter,sp){
            $scope.sp = sp;
            $scope.is_show_kit_group_info = true;
            $scope.cur_tab = "product";
            
            $scope.edit = function(){
                if($scope.cur_tab == 'product'){
                    edit_sp($scope.sp).then(
                         function(updated_sp){ angular.copy(updated_sp,$scope.sp); }
                        ,function(reason){ alert_service('alert',reason,'red'); }
                    )
                }else if($scope.cur_tab == 'group'){
                    edit_group($scope.sp);
                }else if($scope.cur_tab == 'kit'){
                    edit_kit($scope.sp).then(
                         function(updated_sp){ angular.copy(updated_sp,$scope.sp); }
                        ,function(reason){ alert_service('alert',reason,'red'); }
                    )
                }else if($scope.cur_tab == 'sku'){
                    edit_sku($scope.sp);
                }
            }
            $scope.switch_tab = function(name){
                $scope.cur_tab = name;
            }
            $scope.exit = function(){
                $modalInstance.close($scope.sp);
            }
            $scope.duplicate = function(){
                $modalInstance.close('duplicate');
            }
        }

        return function(sp){
            var dlg = $modal.open({
                template: template,
                controller: ModalCtrl,
                size: 'lg',
                resolve : { sp : function(){
                    if(sp.is_instantiate_offline()){ return search_api.product_id_search(sp.product_id); }
                    else{ return sp; }
                }}
            });
            return dlg.result;
        } 
    }]);	
})