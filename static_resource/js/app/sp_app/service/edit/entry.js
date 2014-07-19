define(
[
	'angular'
    //---
    ,'app/sp_app/service/edit/group'
    ,'app/sp_app/service/edit/kit'   
    ,'app/sp_app/service/edit/sku'      
    ,'app/sp_app/service/edit/sp'       
]
,function
(
	angular
)
{
    var mod = angular.module('sp_app.service.edit.entry',['sp_app.service.edit.group','sp_app.service.edit.kit','sp_app.service.edit.sp','sp_app.service.edit.sku']);
    
    mod.factory('sp_app.service.edit.entry',['$modal','sp_app.service.edit.group','sp_app.service.edit.kit','sp_app.service.edit.sp','sp_app.service.edit.sku',function ($modal,edit_group,edit_kit,edit_sp,edit_sku)
    {
        var template =
            '<div class="modal-header">' +
                '<h3 class="modal-title">Info: {{sp.name}}</h3>' +
            '</div>' +

            '<div class="modal-body">' +
                '<tabset justified="true">' +
                    '<tab heading="product" select="switch_tab(\'product\')">' +
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
                                '<p class="col-sm-8 form-control-static">{{sp|compute_sp_kit_field:\'crv\'|currency}}</p>' +
                            '</div>' +

                            '<div class="form-group">' +
                                '<label class="col-sm-4 control-label">Taxable:</label>' +
                                '<p class="form-control-static col-sm-8">' +
                                    '<span ng-class="sp.is_taxable ? \'glyphicon glyphicon-ok\' : \'glyphicon glyphicon-remove\'"></span>' +
                                '</p>' +
                            '</div>' +

                            '<div class="form-group">' +
                                '<label class="col-sm-4 control-label">Cost:</label>' +
                                '<p class="col-sm-8 form-control-static">{{sp|compute_sp_kit_field:\'cost\'|currency}}</p>' +
                            '</div>' +

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
                                '<p class="col-sm-8 form-control-static">{{sp|compute_sp_kit_field:\'buydown\'|currency}}</p>' +
                            '</div>' +

                            '<div class="form-group">' +                               
                                '<label class="col-sm-4 control-label">Value customer price:</label>' +
                                '<p class="col-sm-8 form-control-static">{{sp.value_customer_price|currency}}</p>' +
                            '</div>' +

                        '</div>' + /* end form horizontal*/
                    '</tab>' +
                    
                    '<tab heading="group" select="switch_tab(\'group\')">' +
                        '<table ng-hide="sp.group_set.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
                            '<tr>' +
                                '<th>group</th>' +                
                            '</tr>' +    
                            '<tr ng-repeat="group in sp.group_set">' +
                                '<td>{{group.name}}</td>' +                    
                            '</tr>' +                                                  
                        '</table>' +      
                        '<pre ng-show="sp.group_set.length==0">there is no group</pre>' +         
                    '</tab>' +
                    '<tab heading="kit" select="switch_tab(\'kit\')">' +
                        '<table ng-hide="sp.breakdown_assoc_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
                            '<tr>' +
                                '<th>kit</th>' +              
                                '<th>qty</th>' +  
                            '</tr>' +
                            '<tr ng-repeat="bd in sp.breakdown_assoc_lst">' +
                                '<td>{{bd.breakdown.name}}</td>' +      
                                '<td>{{bd.qty}}</td>' +                                                  
                            '</tr>' +                         
                        '</table>' +  
                        '<pre ng-show="sp.breakdown_assoc_lst.length==0">there is no kit</pre>' +                 
                    '</tab>' +     
                    '<tab heading="sku" select="switch_tab(\'sku\')">' +
                        '<table ng-show="get_my_sku_assoc_lst().length != 0" class="table table-hover table-bordered table-condensed table-striped">' +
                            '<tr>' +
                                '<th>sku</th>' +              
                            '</tr>' +
                            '<tr ng-repeat="sku_assoc in get_my_sku_assoc_lst()">' +
                                '<td>{{sku_assoc.sku_str}}</td>' +      
                            '</tr>' +
                        '</table>' +  
                        '<pre ng-show="get_my_sku_assoc_lst().length == 0">there is no sku</pre>' +                 
                    '</tab>' +                                                          
                '</tabset>' +
            '</div>' + /* end modal body*/

            '<div class="modal-footer">' +
                '<button class="btn btn-primary btn-float-left" ng-click="edit()">edit {{cur_tab}}</button>' +
                '<button ng-click="duplicate()" ng-show="cur_tab==\'product\'" class="btn btn-primary btn-float-left" ng-click="duplicate()">duplicate</button>' +
                '<button class="btn btn-warning" ng-click="exit()">exit</button>' +
            '</div>'
        ;      

        var ModalCtrl = function($scope,$modalInstance,$filter,sp){
            $scope.sp = sp;
            $scope.is_show_kit_group_info = true;
            $scope.cur_tab = "product";
            
            $scope.get_my_sku_assoc_lst = function(){
                return $filter('sku_in_store')($scope.sp.product.prodskuassoc_set,$scope.sp.store_id);
            }
            $scope.edit = function(){
                if($scope.cur_tab == 'product'){
                    edit_sp($scope.sp);
                }else if($scope.cur_tab == 'group'){
                    edit_group($scope.sp);
                }else if($scope.cur_tab == 'kit'){
                    edit_kit($scope.sp);
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
                // scope:$scope,
                size: 'lg',
                resolve : {
                     sp : function(){return sp}
                }
            });
            return dlg.result;
        } 
    }]);	
})