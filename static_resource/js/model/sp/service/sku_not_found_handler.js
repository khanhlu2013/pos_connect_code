define(
[
    'angular'
    //---
    ,'service/ui'
]
,function
(
    angular
)
{
    var mod = angular.module('sp/service/sku_not_found_handler',
    [
         'service/ui'
    ]);
    mod.factory('sp/service/sku_not_found_handler',[
         '$modal'
        ,'$q' 
        ,'sp/service/sku_not_found_handler/select_sp'
        ,'sp/service/sku_not_found_handler/select_product'    
    ,function(
         $modal
        ,$q
        ,select_sp
        ,select_product
    ){
        /*
                                           |
                                           |
                                           V
                    <--------------------START----------------------->
                    |                      |                         |
                    |                      |                         |
                    |                      V                         |
                    |  |-------------> CREATE_NEW <---------------|  |
                    V  |                                          |  V
                 ADD_SKU  <-----------------------------------> ADD_PRODUCT
                    |                                                |
                    |                                                |
                    |------------------> CANCEL <--------------------|
                    |                                                |
                    |                                                |
                    V                                                V
                RETURN_SP                                       RETURN PRODUCT
    
        */
        return function(product_lst,my_sp_lst,sku){
            var defer = $q.defer();

            if(product_lst.length === 0 && my_sp_lst.length === 0){
                defer.resolve(null);
            }else if(my_sp_lst.length !== 0){
                select_sp(product_lst,my_sp_lst,sku).then(
                    function(response){
                        defer.resolve(response);
                    }
                    ,function(reason){
                        defer.reject(reason);
                    }
                )
            }else /*if(product_lst.length !== 0) -- this must be the only case left*/{
                select_product(product_lst,my_sp_lst,sku).then(
                    function(response){
                        defer.resolve(response);
                    }
                    ,function(reason){
                        defer.reject(reason);
                    }
                )
            }

            return defer.promise;
        }    
    }])

    mod.factory('sp/service/sku_not_found_handler/select_sp',[
         '$modal'
        ,'$injector'
        ,'service/ui/confirm'          
    ,function(
         $modal
        ,$injector
        ,confirm_service
    ){
        /*
            Precondition: sp_lst to select must not be empty. p_lst could be emtpy or not
        */
        return function(product_lst,my_sp_lst,sku){
            var template = 
                '<div id="sp_app/service/suggest/select_sp_dlg" class="modal-header"><h3>sku: {{sku}} not found</h3></div>' +
                '<div class="modal-body">' +
                    '<h3>Option 1</h3>' +
                    '<div class="indent_40px">' +
                        '<label>These products are <mark>already inside</mark> your database. If scanned product is found here, you can <mark>simply</mark> add sku.</label>' +
                        '<table class="table table-hover table-bordered table-condensed table-striped">' + 
                            '<tr>' +
                                '<th>your product</th>' +
                                '<th>price</th>' +
                                '<th>taxable</th>' +
                                '<th>crv</th>' +
                                '<th>cost</th>' +
                                '<th>buydown</th>' +
                                '<th><span class="glyphicon glyphicon-plus"> sku</span></th>' +
                            '</tr>' +
                            '<tr ng-repeat="sp in my_sp_lst">' +
                                '<td>{{sp.name}}</td>' +
                                '<td>{{sp.price | currency}}</td>' +
                                '<td class="alncenter"><span class="glyphicon" ng-class="sp.is_taxable ? \'glyphicon-check\' : \'glyphicon-unchecked\'"></span></td>' +
                                '<td>{{sp.get_crv()}}</td>' +
                                '<td>{{sp.get_cost()}}</td>' +
                                '<td>{{sp.get_buydown()}}</td>' +
                                '<td class="alncenter"><button ng-click="return_sp(sp)" class="btn btn-primary glyphicon glyphicon-plus"> sku</button></td>' +
                            '</tr>' +
                        '</table>' + 
                    '</div>' +
                    '<h3>Option 2</h3>' +
                    '<div class="indent_40px">' +
                        '<label>If scanned product is <mark>not</mark> found:</label>' +
                        '<button id="sp_app/service/suggest/select_sp_dlg/create_new_product_btn" ng-click="create_new_product()" ng-hide="product_lst.length !== 0" class="btn btn-primary">create new product</button>' +
                        '<button id="sp_app/service/suggest/select_sp_dlg/select_product_btn" ng-click="select_product()" ng-hide="product_lst.length === 0" class="btn btn-primary">see network suggestion</button>' +                                         
                    '</div>' +
                '</div>' + 
                '<div class="modal-footer">' +
                    '<button ng-click="cancel()" class="btn btn-warning">cancel</button>' +
                '</div>'
            ;
            var ModalCtrl = function($scope,$modalInstance,product_lst,my_sp_lst,sku){
                $scope.product_lst = product_lst;
                $scope.my_sp_lst = my_sp_lst;
                $scope.sku = sku;                
                $scope.cancel = function(){
                    $modalInstance.dismiss('_cancel_');
                }
                $scope.return_sp = function(sp){
                    confirm_service('Confirm: adding ' + sku + ' sku to ' + sp.name + ' ?').then(
                        function(){
                            $modalInstance.close(sp);
                        }
                    )
                }
                $scope.select_product = function(){
                    var select_product_service = $injector.get('sp/service/sku_not_found_handler/select_product')
                    select_product_service(product_lst,my_sp_lst,sku).then(
                        function(response){
                            $modalInstance.close(response);
                        }
                        ,function(reason){
                            $modalInstance.dismiss(reason);
                        }
                    )
                }
                $scope.create_new_product = function(){
                    $modalInstance.close(null);
                }
            }
            ModalCtrl.$inject = ['$scope','$modalInstance','product_lst','my_sp_lst','sku'];    
            var dlg = $modal.open({
                 template:template
                ,controller:ModalCtrl
                ,size:'lg'
                ,backdrop : 'static'
                ,resolve : {
                     product_lst : function(){
                        return product_lst;
                    }
                    ,my_sp_lst : function(){
                        return my_sp_lst;
                    }
                    ,sku : function(){
                        return sku;
                    }
                }
            })
            return dlg.result;
        }    
    }]) 

    mod.factory('sp/service/sku_not_found_handler/select_product',[
         '$modal'
        ,'$injector'
        ,'sp/service/sku_not_found_handler/select_product_confirmation'
    ,function(
         $modal
        ,$injector
        ,select_product_confirmation
    ){
        return function(product_lst,my_sp_lst,sku){
            var template = 
                '<div id="sp_app/service/suggest/select_product_dlg" class="modal-header"><h3>sku: {{sku}} not found</h3></div>' +
                '<div class="modal-body">' +
                    '<h3>Option 1</h3>' +
                    '<div class="indent_40px">' +
                        '<label>Select a product to add</label>' +
                        '<table class="table table-hover table-bordered table-condensed table-striped">' + 
                            '<tr>' +
                                '<th>store count</th>' +                            
                                '<th>name</th>' +
                                '<th>price</th>' +                                
                                '<th>crv</th>' +          
                                '<th>tax</th>' + 
                                '<th>cost</th>' +   
                                '<th>add</th>' +
                            '</tr>' +
                            '<tr ng-repeat="product in product_lst |orderBy:\'-get_sp_lst().length\'">' +
                                '<td>{{product.get_sp_lst().length}}</td>' +                                        
                                '<td>{{product.get_suggest_main(\'name\').value}}</td>' +
                                '<td>{{product.get_suggest_main(\'price\')|currency}}</td>' +
                                '<td>{{product.get_suggest_main(\'crv\').value|currency}}</td>' +
                                '<td class="alncenter">' +
                                    '<div ng-hide="product.get_suggest_main(\'is_taxable\').percent === 50">' +
                                        '<span' +
                                            ' class="glyphicon"' +
                                            ' ng-attr-id="sp_app/service/suggest/select_product_dlg/lst/is_taxable/sign/{{product.id}}"' +
                                            ' ng-class="product.get_suggest_main(\'is_taxable\').value === true ? \'glyphicon-check\' : \'glyphicon-unchecked\'">' +
                                        '</span>' +
                                        '<span ' +
                                            ' ng-attr-id="sp_app/service/suggest/select_product_dlg/lst/is_taxable/percent/{{product.id}}"' +
                                            ' ng-hide="product.get_suggest_main(\'is_taxable\').percent === 100 ">' + 
                                                '({{product.get_suggest_main(\'is_taxable\').percent}}%)' + 
                                        '</span>' +                                        
                                    '</div>' +
                                '</td>' +
                                '<td>{{product.get_suggest_main(\'cost\')|currency}}</td>' +
                                '<td class="alncenter"><button ng-click="select_product(product)" class="btn btn-primary glyphicon glyphicon-plus"></button></td>' +
                            '</tr>' +                           
                        '</table>' +
                    '</div>' +

                    '<h3>Option 2</h3>' +
                    '<div class="indent_40px">' +
                        '<label>If not found,</label>' +
                        '<button id="sp_app/service/suggest/select_product_dlg/create_new_product_btn" ng-click="create_new_product()" class="btn btn-primary">create new product</button>' +
                    '</div>' +

                '</div>' +                
                '<div class="modal-footer">' +
                    '<button id="sp_app/service/suggest/select_product_dlg/select_sp" ng-click="select_sp()" ng-hide="my_sp_lst.length === 0" class="btn btn-primary btn-float-left">back</button>' +
                    '<button ng-click="cancel()" class="btn btn-warning">cancel</button>' +
                '</div>'
            ;
            var ModalCtrl = function($scope,$modalInstance,product_lst,my_sp_lst,sku){
                $scope.product_lst = product_lst;
                $scope.my_sp_lst = my_sp_lst;
                $scope.sku = sku;
                $scope.cancel = function(){
                    $modalInstance.dismiss('_cancel_');
                }
                $scope.select_product = function(product){
                    select_product_confirmation(product,product_lst,my_sp_lst,sku).then(
                        function(response){
                            $modalInstance.close(response);
                        }
                        ,function(reason){
                            $modalInstance.dismiss(reason);
                        }
                    )
                }
                $scope.select_sp = function(){
                    var select_sp_service = $injector.get('sp/service/sku_not_found_handler/select_sp')
                    select_sp_service(product_lst,my_sp_lst,sku).then(
                        function(response){
                            $modalInstance.close(response);
                        }
                        ,function(reason){
                            $modalInstance.dismiss(reason);
                        }
                    )
                }
                $scope.create_new_product = function(){
                    $modalInstance.close(null);
                }
            }
            ModalCtrl.$inject = ['$scope','$modalInstance','product_lst','my_sp_lst','sku'];    
            var dlg = $modal.open({
                 template:template
                ,controller:ModalCtrl
                ,size:'lg'
                ,backdrop : 'static'
                ,resolve : {
                     product_lst : function(){
                        return product_lst;
                    }
                    ,my_sp_lst : function(){
                        return my_sp_lst;
                    }
                    ,sku : function(){
                        return sku;
                    }
                }
            })
            return dlg.result;
        }    
    }])         

    mod.factory('sp/service/sku_not_found_handler/select_product_confirmation',[
         '$modal'
        ,'$injector'
    ,function(
         $modal
        ,$injector
    ){
        return function(network_product,product_lst,my_sp_lst,sku){
            var template = 
                '<div id="sp_app/service/suggest/select_product_confirm_dlg" class="modal-header"><h3>confirm add product</h3></div>' +
                '<div class="modal-body">' +
                    '<div ng-include="$root.GLOBAL_SETTING.partial_url.product.network_product.index">' +   
                    '</div>' +
                '</div>' +                
                '<div class="modal-footer">' +
                    '<button ng-click="select_product()" class="btn btn-primary btn-float-left">back</button>' +
                    '<button id="sp_app/service/suggest/select_product_confirm_dlg/ok_btn" ng-click="return_product()" class="btn btn-success">add product</button>' +
                    '<button ng-click="cancel()" class="btn btn-warning">cancel</button>' +
                '</div>'
            ;
            var ModalCtrl = function($scope,$modalInstance,$rootScope,network_product,product_lst,my_sp_lst,sku){
                //start - contract for network_product partial to work
                $scope.network_product = network_product;
                $scope.network_product_summary_lbl_class = 'col-xs-4 control-label';
                $scope.network_product_summary_value_class = 'col-xs-8 form-control-static';   
                $scope.suggest_extra_crv = $scope.network_product.get_suggest_extra('crv');
                $scope.suggest_extra_name = $scope.network_product.get_suggest_extra('name');
                $scope.is_sale_data = false;//read this variable description in the partial template of network_product

                $scope.cur_sort_column = 'get_cost()';
                $scope.cur_sort_desc = false;
                $scope.column_click = function(column_name){
                    if($scope.cur_sort_column == column_name){
                        $scope.cur_sort_desc = !$scope.cur_sort_desc;
                    }else{
                        $scope.cur_sort_column = column_name;
                        $scope.cur_sort_desc = false;
                    }
                }
                $scope.get_sort_class = function(column_name){
                    if(column_name == $scope.cur_sort_column){
                        return "glyphicon glyphicon-arrow-" + ($scope.cur_sort_desc ? 'down' : 'up');
                    }else{
                        return '';
                    }
                }                
                //end - contract
                
                $scope.cancel = function(){
                    $modalInstance.dismiss('_cancel_');
                }
                $scope.return_product = function(){
                    $modalInstance.close(network_product);
                }
                $scope.select_product = function(){
                    var select_product_service = $injector.get('sp/service/sku_not_found_handler/select_product')
                    select_product_service(product_lst,my_sp_lst,sku).then(
                        function(response){
                            $modalInstance.close(response);
                        }
                        ,function(reason){
                            $modalInstance.dismiss(reason);
                        }
                    )
                }
            }
            ModalCtrl.$inject = ['$scope','$modalInstance','$rootScope','network_product','product_lst','my_sp_lst','sku'];    
            var dlg = $modal.open({
                 template:template
                ,controller:ModalCtrl
                ,size:'lg'
                ,backdrop : 'static'
                ,resolve : {
                     network_product : function(){
                        return network_product;
                    }                    
                    ,product_lst : function(){
                        return product_lst;
                    }
                    ,my_sp_lst : function(){
                        return my_sp_lst;
                    }
                    ,sku : function(){
                        return sku;
                    }
                }
            })
            return dlg.result;
        }    
    }])
})