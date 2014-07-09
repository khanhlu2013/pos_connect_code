define(
[
     'angular'
    //---------------
    ,'app/store_product_angular_app/service/search_service'
    ,'app/group_angular_app/service'
], function
(
    angular
)
{
    var service_mod = angular.module('store_product_app.services', ['sp_app.search','group_app.service']);

    service_mod.factory('sp_prompt_kit_service',['$modal','search_and_select_service',function($modal,search_service){
        var template = 
            '<div class="modal-header">' +
                '<h3 class="modal-title">{{original_assoc.id == null ? \'create new kit\' : \'edit kit: \' + original_assoc.breakdown.name}}</h3>' +
            '</div>' +

            '<form name="form" class="modal-body" novalidate>' +
                '<div class="form-horizontal" >' +
                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label" >Name:</label>' +
                        '<div class="col-sm-8">' +
                            '<input name="name" ng-model="assoc.breakdown.name" type="text" required disabled>' +
                            '<button ng-click="search()" class="btn btn-primary glyphicon glyphicon-search"></button>' +     
                            '<label class="error" ng-show="form.name.$invalid">' +
                                'required.' +
                            '</label>' +                                                 
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">Qty:</label>' +
                        '<div class="col-sm-8">' +
                            '<input name="qty" ng-model="assoc.qty" type="number" min="1" ng-pattern="integer_validation" required />' +
                            '<label class="error" ng-show="form.qty.$invalid">' +
                                '<span ng-show="form.qty.$error.required">required</span>' +
                                '<span ng-show="form.qty.$error.pattern || form.qty.$error.min">invalid number</span>' +
                            '</label>'+ 
                        '</div>' +
                    '</div>' +                 
                '</div>' + /* end form horizontal*/
            '</form>' + /* end modal body*/

            '<div class="modal-footer">' +          
                '<button class="btn btn-warning" ng-click="cancel()">cancel</button>' + 
                '<button ng-disabled="is_unchange()" class="btn btn-primary" ng-click="reset()">reset</button>' +                               
                '<button ng-disabled="is_unchange()||form.$invalid" class="btn btn-success" ng-click="ok()">ok</button>' +
            '</div>'        
        ;  
        var ModalCtrl = function($scope,$modalInstance,original_assoc){
            $scope.original_assoc = original_assoc == null ? {} : original_assoc;
            $scope.assoc = angular.copy($scope.original_assoc);
            $scope.integer_validation = /^\d*$/;
            $scope.search = function(){
                var promise = search_service(false/*is_multiple_select: can not select multiple*/);
                promise.then(
                    function(sp){
                        $scope.assoc.breakdown = sp;
                    },
                    function(reason){
                        //do nothing
                    }
                )
            }
            $scope.is_unchange = function(){
                return angular.equals($scope.original_assoc,$scope.assoc)
            } 
            $scope.reset = function(){
                $scope.assoc = angular.copy($scope.original_assoc);
            }
            $scope.cancel = function(){
                $modalInstance.dismiss('cancel');
            }
            $scope.ok = function(){
                angular.copy($scope.assoc,$scope.original_assoc);
                $modalInstance.close($scope.original_assoc);
            }
        }
        return function(original_assoc){
            var dlg = $modal.open({
                template:template,
                controller:ModalCtrl,
                backdrop:'static',
                size:'lg',
                resolve:{
                    original_assoc : function(){return original_assoc}
                }
            });
            return dlg.result;
        }
    }]);

    service_mod.factory('sp_edit_kit_service',['$modal','sp_prompt_kit_service',function($modal,sp_prompt_kit_service){
        var template = 
            '<div class="modal-header">' +
                '<h3 class="modal-title">Kit info: {{sp.name}}</h3>' +
            '</div>' +

            '<div class="modal-body">' +   

                '<button ng-click="add()" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span></button>' +
                '</br>' +
                '<table ng-hide="sp.breakdown_assoc_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
                    '<tr>' +
                        '<th>kit</th>' +   
                        '<th>qty</th>' +        
                        '<th>edit</th>' +                            
                        '<th>remove</th>' +                
                    '</tr>' +    
                    '<tr ng-repeat="assoc in sp.breakdown_assoc_lst">' +
                        '<td>{{assoc.breakdown.name}}</td>' +    
                        '<td>{{assoc.qty}}</td>' +
                        '<td><button ng-click="edit(assoc)" class="btn btn-primary glyphicon glyphicon-pencil"></button></td>' +                                 
                        '<td><button ng-click="remove(assoc)" class="btn btn-danger glyphicon glyphicon-trash"></button></td>' +                                            
                    '</tr>' +                                                  
                '</table>' +
                '<div ng-show="sp.breakdown_assoc_lst.length==0">' +
                    '</br>' +
                    '<pre>No kit!</pre>' +
                '</div>' +

            '</div>' +

            '<div class="modal-footer">' +          
                '<button class="btn btn-warning" ng-click="cancel()">cancel</button>' + 
                '<button ng-disabled="is_unchange()" class="btn btn-primary" ng-click="reset()">reset</button>' +                               
                '<button ng-disabled="is_unchange()||form.$invalid" class="btn btn-success" ng-click="save()">save</button>' +
            '</div>'        
        ;   
        var ModalCtrl = function($scope,$modalInstance,$http,original_sp){
            $scope.original_sp = original_sp;
            $scope.sp = angular.copy(original_sp);

            $scope.is_unchange = function(){
                return angular.equals($scope.original_sp,$scope.sp);
            }
            $scope.reset = function(){
                $scope.sp = angular.copy($scope.original_sp);
            }
            $scope.edit = function(assoc){
                var promise = sp_prompt_kit_service(assoc);
                promise.then(
                    function(assoc){
                        // 2way binding taking care of updating
                    },
                    function(reason){

                    }
                )
            }
            $scope.remove = function(assoc){
                for(var i = 0 ; i < $scope.sp.breakdown_assoc_lst.length;i++){
                    if(assoc.id === $scope.sp.breakdown_assoc_lst[i].id){
                        $scope.sp.breakdown_assoc_lst.splice(i,1);
                        break;
                    }
                }
            }
            $scope.cancel = function(){
                $modalInstance.dismiss('cancel');
            }
            $scope.add = function(){
                var promise = sp_prompt_kit_service(null);
                promise.then(
                    function(assoc){
                        $scope.sp.breakdown_assoc_lst.push(assoc);
                    },
                    function(){

                    }
                )
            }
            $scope.save = function(){
                var promise = $http({
                    url:'/product/kit/update_angular',
                    method:'POST',
                    data:{sp:JSON.stringify($scope.sp)}
                });

                promise.success(function(data, status, headers, config){
                    angular.copy(data,$scope.original_sp);
                    $modalInstance.close(data);                    
                });
                promise.error(function(data, status, headers, config){
                    alert('ajax error');
                });                
            }
        };
        return function(sp){
            var dlg = $modal.open({
                template:template,
                controller:ModalCtrl,
                backdrop:'static',
                size:'lg',
                resolve:{
                    original_sp:function(){return sp}
                }
            })
            return dlg.result;
        }
    }]);

    service_mod.factory('sp_edit_group_service',['$modal','group_app.group_select_service',function($modal,group_select){
        var template = 
            '<div class="modal-header">' +
                '<h3 class="modal-title">Group info: {{sp.name}}</h3>' +
            '</div>' +

            '<div class="modal-body">' +   

                '<button ng-click="add()" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span></button>' +
                '</br>' +
                '<table ng-hide="sp.group_set.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
                    '<tr>' +
                        '<th>group</th>' +         
                        '<th>remove</th>' +                
                    '</tr>' +    
                    '<tr ng-repeat="group in sp.group_set">' +
                        '<td>{{group.name}}</td>' +    
                        '<td><button ng-click="remove(group)" class="btn btn-danger glyphicon glyphicon-trash"></button></td>' +                                            
                    '</tr>' +                                                  
                '</table>' +
                '<div ng-show="sp.group_set.length==0">' +
                    '</br>' +
                    '<pre>No group!</pre>' +
                '</div>' +

            '</div>' +

            '<div class="modal-footer">' +          
                '<button class="btn btn-warning" ng-click="cancel()">cancel</button>' + 
                '<button ng-disabled="is_unchange()" class="btn btn-primary" ng-click="reset()">reset</button>' +                               
                '<button ng-disabled="is_unchange()||form.$invalid" class="btn btn-success" ng-click="save()">save</button>' +
            '</div>'        
        ;    

        var ModalCtrl = function($scope,$modalInstance,$http,$filter,original_sp){
            $scope.original_sp = original_sp;
            $scope.sp = angular.copy(original_sp);

            $scope.is_unchange = function() {
                return angular.equals($scope.original_sp, $scope.sp);
            };   
            $scope.add = function(){
                var promise = group_select(true/*allow to select multiple group*/);
                promise.then(function (result_lst) {
                    for(var i = 0;i<result_lst.length;i++){
                        if($filter('get_item_from_lst_base_on_id')($scope.sp.group_set,result_lst[i].id) == null) {
                            $scope.sp.group_set.push(result_lst[i]);
                        }
                    }
                }, function () {
                    //do nothing
                });                
            }
            $scope.remove = function(group){
                for(var i = 0;i<$scope.sp.group_set.length;i++){
                    if($scope.sp.group_set[i].id === group.id){
                        $scope.sp.group_set.splice(i,1);
                    }
                }
            };         
            $scope.reset = function(){
                $scope.sp = angular.copy($scope.original_sp)
            };            
            $scope.cancel = function(){
                $modalInstance.dismiss('cancel');
            };
            $scope.save = function(){
                //update sp
                var promise = $http({
                    url: '/product/group/update_angular',
                    method : "POST",
                    data: {sp:JSON.stringify($scope.sp)}
                });
                promise.success(function(data, status, headers, config){
                    angular.copy(data,$scope.original_sp);
                    $modalInstance.close($scope.original_sp);
                });
                promise.error(function(data, status, headers, config){
                    alert('ajax error');
                });     
            };
        }

        return function(sp){
            var dlg = $modal.open({
                template: template,
                controller: ModalCtrl,
                backdrop:'static',
                // scope:$scope,
                size: 'lg',
                resolve : {
                    original_sp : function(){return sp}
                }
            });
            return dlg.result;
        }            
    }]);

    service_mod.factory('sp_edit_service',['$modal', function($modal){

        var template =
            '<div class="modal-header">' +
                '<h3 class="modal-title">{{calculate_title()}}</h3>' +
            '</div>' +

            '<form name="form" class="modal-body" novalidate>' +
                '<div class="form-horizontal" >' +
                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label" >Name:</label>' +
                        '<div class="col-sm-8">' +
                            '<input name="name" ng-model="sp.name" type="text" required>' +
                            '<button ng-hide="sp_suggest==null" class="btn btn-primary">{{sp_suggest.name}}</button>' +     
                            '<label class="error" ng-show="form.name.$dirty && form.name.$invalid">' +
                                'name is required.' +
                            '</label>' +                                                 
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">Price:</label>' +
                        '<div class="col-sm-8">' +
                            '<input name="price" ng-model="sp.price" type="number">' +
                            '<button ng-hide="sp_suggest==null" class="btn btn-primary">suggest price ...</button>' +
                            '<label class="error" ng-show="form.price.$dirty && form.price.$invalid">' +
                                'Invalid number' +
                            '</label>' +                                 
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">Crv:</label>' +
                        '<div class="col-sm-8">' +
                            '<input name="crv" ng-model="sp.crv" ng-disabled="{{sp|is_kit}}" type="number">' +
                            '<button ng-hide="sp_suggest==null" class="btn btn-primary" id="suggest_crv_btn">suggest crv ...</button>' +  
                            '<label class="error" ng-show="form.crv.$dirty && form.crv.$invalid">' +
                                'Invalid number' +
                            '</label>' +                                                            
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">Taxable:</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="sp.is_taxable" type="checkbox">' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">Cost:</label>' +
                        '<div class="col-sm-8">' +
                            '<input name="cost" ng_model="sp.cost" ng-disabled="{{sp|is_kit}}" type="number" value="{{sp|compute_sp_kit_field:\'cost\'}}"">' +
                            '<button ng-hide="sp_suggest==null" class="btn btn-primary" id = "suggest_cost_btn">suggest cost ...</button>' + 
                            '<label class="error" ng-show="form.cost.$dirty && form.cost.$invalid">' +
                                'Invalid number' +
                            '</label>' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">Sale report:</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="sp.is_sale_report" type="checkbox">' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">Type:</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="sp.p_type" type="text">' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">Tag:</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="sp.p_tag" type="text">' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">Vendor:</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="sp.vendor" type="text">' +
                        '</div>' +    
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">Buydown:</label>' +
                        '<div class="col-sm-8">' +
                            '<input name="buydown" ng-disabled="{{sp|is_kit}}" ng-model="sp.buydown" type="number" value="{{sp|compute_sp_kit_field:\'buydown\'}}">' +    
                            '<label class="error" ng-show="form.buydown.$dirty && form.buydown.$invalid">' +
                                'Invalid number' +
                            '</label>' +                                     
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">value customer price:</label>' +
                        '<div class="col-sm-8">' +
                            '<input name="value_customer_price" ng-model="sp.value_customer_price" type="number" />' +
                            '<label class="error" ng-show="form.value_customer_price.$dirty && form.value_customer_price.$invalid">' +
                                'Invalid number' +
                            '</label>' +
                        '</div>' +
                    '</div>' +

                    '<div ng-show="sp == null"class="form-group">' +
                        '<label class="col-sm-4 control-label">Sku:</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-model="sku" type="text">' +
                        '</div>' +
                    '</div>' +                    
                '</div>' + /* end form horizontal*/
            '</form>' + /* end modal body*/

            '<div class="modal-footer">' +          
                '<button class="btn btn-warning" ng-click="cancel()">cancel</button>' + 
                '<button ng-disabled="is_unchange()" class="btn btn-primary" ng-click="reset()">reset</button>' +                               
                '<button ng-disabled="is_unchange()||form.$invalid" class="btn btn-success" ng-click="save()">save</button>' +
            '</div>'
        ;      

        var ModalCtrl = function($scope,$modalInstance,$filter,$http,original_sp,suggest_sp,duplicate_sp,sku){
            $scope.original_sp = original_sp;
            $scope.sp = angular.copy(original_sp);
            $scope.suggest_sp = suggest_sp;
            $scope.duplicate_sp = duplicate_sp;
            $scope.sku = sku;

            //init kit value: we need this because what we store inside sp.kit_field could be different that the current calculated kid field. Thus, we init sp.kit_field to be the actual currently calculated field sp that it will display correctly 
            if($scope.sp!=null && $filter('is_kit')($scope.sp)){
                $scope.sp.crv = $filter('compute_sp_kit_field')($scope.sp,'crv');
                $scope.sp.cost = $filter('compute_sp_kit_field')($scope.sp,'cost');
                $scope.sp.buydown = $filter('compute_sp_kit_field')($scope.sp,'buydown');
            }

            $scope.is_unchange = function() {
                return angular.equals($scope.original_sp, $scope.sp);
            };            
            $scope.calculate_title = function(){
                if($scope.suggest_sp != null){
                    return 'Add: ' + $scope.suggest_sp.name;
                }else if($scope.duplicate_sp != null){
                    return 'Duplicate: ' + $scope.duplicate_sp.name;
                }else{
                    return 'Edit: ' + $scope.original_sp.name;
                }
            };
            $scope.reset = function(){
                $scope.sp = angular.copy($scope.original_sp)
            };            
            $scope.cancel = function(){
                $modalInstance.dismiss('cancel');
            };
            $scope.save = function(){
                
                //Validate sp make sure it is valide. 
                //Based on original_sp and suggest_sp we know that it is edit/create_new_sp/create_old_sp. We then ajax to server accordingly.
                //Receive ajax response and populate into $scope.original_sp 
                
                if($scope.original_sp == null){
                    if($scope.suggest_sp){
                        //create old sp
                        alert('creating old sp to be implemented');
                        return;
                    }else{
                        //create new sp
                        alert('creating new sp to be implemented');
                        return;
                    }   
                }else{
                    //update sp
                    var promise = $http({
                        url: '/product/update_sp_angular',
                        method : "POST",
                        data: {sp:JSON.stringify($scope.sp)}
                    });
                    promise.success(function(data, status, headers, config){
                        angular.copy(data,$scope.original_sp);
                        $modalInstance.close($scope.original_sp);
                    });
                    promise.error(function(data, status, headers, config){
                        alert('ajax error');
                    });                                        
                }
            };
        }

        return function(original_sp,suggest_sp,duplicate_sp,sku){
            var dlg = $modal.open({
                template: template,
                controller: ModalCtrl,
                backdrop:'static',
                // scope:$scope,
                size: 'lg',
                resolve : {
                     original_sp : function(){return original_sp}
                    ,suggest_sp : function(){return suggest_sp}
                    ,duplicate_sp : function(){return duplicate_sp}
                    ,sku : function(){return sku}
                }
            });
            return dlg.result;
        }   
    }]);


    //---------------------------------------------------------------------------------------------------------------------------------------------------------------
    //SP INFO SERVICE------------------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------    
    service_mod.factory('sp_info_service',['$modal','sp_edit_service','sp_edit_group_service','sp_edit_kit_service',function($modal,sp_edit_service,sp_edit_group_service,sp_edit_kit_service){

        var template =
            '<div class="modal-header">' +
                '<h3 class="modal-title">Info: {{sp.name}}</h3>' +
            '</div>' +

            '<div class="modal-body">' +
                '<tabset justified="true">' +
                    '<tab heading="product" select="switch_tab(\'product\')">' +
                        '<div class="form-horizontal" >' +
                            '<label class="col-sm-4 control-label">Name:</label>' +
                            '<p class="col-sm-8 form-control-static">{{sp.name}}</p>' +

                            '<label class="col-sm-4 control-label">Price:</label>' +
                            '<p class="col-sm-8 form-control-static">{{sp.price | currency}}</p>' +

                            '<label class="col-sm-4 control-label">Crv:</label>' +
                            '<p class="col-sm-8 form-control-static">{{sp|compute_sp_kit_field:\'crv\'|currency}}</p>' +

                            '<div class="form-group">' +
                                '<label class="col-sm-4 control-label">Taxable:</label>' +
                                '<p class="form-control-static col-sm-8">' +
                                    '<span ng-class="sp.is_taxable ? \'glyphicon glyphicon-ok\' : \'glyphicon glyphicon-remove\'"></span>' +
                                '</p>' +
                            '</div>' +

                            '<label class="col-sm-4 control-label">Cost:</label>' +
                            '<p class="col-sm-8 form-control-static">{{sp|compute_sp_kit_field:\'cost\'|currency}}</p>' +

                            '<div class="form-group">' +
                                '<label class="col-sm-4 control-label">Sale report:</label>' +
                                '<p class="form-control-static col-sm-8">' +
                                    '<span ng-class="sp.is_sale_report ? \'glyphicon glyphicon-ok\' : \'glyphicon glyphicon-remove\'"></span>' +
                                '</p>' +
                            '</div>' +

                            '<label class="col-sm-4 control-label">Type:</label>' +
                            '<p class="col-sm-8 form-control-static">{{sp.p_type}}</p>' +

                            '<label class="col-sm-4 control-label">Tag:</label>' +
                            '<p class="col-sm-8 form-control-static">{{sp.p_tag}}</p>' +

                            '<label class="col-sm-4 control-label">Vendor:</label>' +
                            '<p class="col-sm-8 form-control-static">{{sp.vendor}}</p>' +

                            '<label class="col-sm-4 control-label">Buydown:</label>' +
                            '<p class="col-sm-8 form-control-static">{{sp|compute_sp_kit_field:\'buydown\'|currency}}</p>' +

                            '<label class="col-sm-4 control-label">Value customer price:</label>' +
                            '<p class="col-sm-8 form-control-static">{{sp.value_customer_price|currency}}</p>' +

                            '_' + /* don't know why we need this to eliminate the horizontal line overflow in modal-body*/
                        '</div>' + /* end form horizontal*/
                    '</tab>' +
                    
                    '<tab heading="group" select="switch_tab(\'group\')">' +
                        '<table ng-hide="sp.group_set.length==0" id="group_tbl" class="table table-hover table-bordered table-condensed table-striped">' +
                            '<tr>' +
                                '<th>group</th>' +                
                            '</tr>' +    
                            '<tr ng-repeat="group in sp.group_set">' +
                                '<td>{{group.name}}</td>' +                    
                            '</tr>' +                                                  
                        '</table>' +                    
                    '</tab>' +
                    '<tab heading="kit" select="switch_tab(\'kit\')">' +
                        '<table ng-hide="sp.breakdown_assoc_lst.length==0" id="kit_tbl" class="table table-hover table-bordered table-condensed table-striped">' +
                            '<tr>' +
                                '<th>kit</th>' +              
                                '<th>qty</th>' +  
                            '</tr>' +
                            '<tr ng-repeat="bd in sp.breakdown_assoc_lst">' +
                                '<td>{{bd.breakdown.name}}</td>' +      
                                '<td>{{bd.qty}}</td>' +                                                  
                            '</tr>' +                         
                        '</table>' +                    
                    '</tab>' +                                        
                '</tabset>' +
            '</div>' + /* end modal body*/

            '<div class="modal-footer">' +
                '<button class="btn btn-primary btn-float-left" ng-click="edit()">{{cur_tab}}</button>' +
                '<button class="btn btn-warning" ng-click="exit()">exit</button>' +
            '</div>'
        ;      

        var ModalCtrl = function($scope,$modalInstance,sp){
            $scope.sp = sp;
            $scope.is_show_kit_group_info = true;
            $scope.cur_tab = "product";
            $scope.edit = function(){
                if($scope.cur_tab == "product"){
                    sp_edit_service($scope.sp,null/*suggest_sp*/,null/*duplicate_sp*/,null/*sku*/);
                }
                else if($scope.cur_tab == "group"){
                    sp_edit_group_service($scope.sp);
                }
                else if($scope.cur_tab == "kit"){
                    sp_edit_kit_service($scope.sp);
                }
                else{
                    alert('bug');
                }
            }
            $scope.switch_tab = function(name){
                $scope.cur_tab = name;
            }
            $scope.exit = function(){
                $modalInstance.close($scope.sp);
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
});