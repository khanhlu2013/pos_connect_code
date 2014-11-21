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
    var mod = angular.module('sp_app/service/suggest',
    [
        'service/ui'
    ]);
    mod.factory('sp_app/service/suggest',[
         '$modal'
        ,'$q' 
        ,'sp_app/service/suggest/select_sp'
        ,'sp_app/service/suggest/select_product'    
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

    mod.factory('sp_app/service/suggest/select_sp',[
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
                    var select_product_service = $injector.get('sp_app/service/suggest/select_product')
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

    mod.factory('sp_app/service/suggest/select_product',[
         '$modal'
        ,'$injector'
        ,'sp_app/service/suggest/select_product_confirmation'
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
                    var select_sp_service = $injector.get('sp_app/service/suggest/select_sp')
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

    mod.factory('sp_app/service/suggest/select_product_confirmation',[
         '$modal'
        ,'$injector'
    ,function(
         $modal
        ,$injector
    ){
        return function(product_to_add,product_lst,my_sp_lst,sku){
            var template_summary = 
                '<label>Product summary</label>' +
                '<div class="form-horizontal" >' +
                    '<div class="form-group">' +
                        '<label ng-class="suggest_summary_lbl_class">name:</label>' +
                        '<p id="sp_app/service/suggest/select_product_confirm_dlg/summary/name_lbl" ng-class="suggest_summary_value_class">{{product_to_add.get_suggest_main(\'name\').value}}</p>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label ng-class="suggest_summary_lbl_class">price:</label>' +
                        '<p id="sp_app/service/suggest/select_product_confirm_dlg/summary/price_lbl" ng-class="suggest_summary_value_class">{{product_to_add.get_suggest_main(\'price\')|currency}}</p>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label ng-class="suggest_summary_lbl_class">tax:</label>' +
                        '<p ng-hide="product_to_add.get_suggest_main(\'is_taxable\').percent === 50" ng-class="suggest_summary_value_class">' +
                            '<span' +
                                ' id="sp_app/service/suggest/select_product_confirm_dlg/summary/is_taxable/sign_span"' +
                                ' class="glyphicon"' +
                                ' ng-class="product_to_add.get_suggest_main(\'is_taxable\').value === true ? \'glyphicon-check\' : \'glyphicon-unchecked\'">' +
                            '</span>' +
                            '<span' +
                                ' id="sp_app/service/suggest/select_product_confirm_dlg/summary/is_taxable/percent_span"' +
                                ' ng-hide="product_to_add.get_suggest_main(\'is_taxable\').percent === 100">' + 
                                    '({{product_to_add.get_suggest_main(\'is_taxable\').percent}}%)' +
                            '</span>' +
                        '</p>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label ng-class="suggest_summary_lbl_class">crv:</label>' +
                        '<p id="sp_app/service/suggest/select_product_confirm_dlg/summary/crv_lbl" ng-class="suggest_summary_value_class">{{product_to_add.get_suggest_main(\'crv\').value|currency}}</p>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label ng-class="suggest_summary_lbl_class">cost:</label>' +
                        '<p id="sp_app/service/suggest/select_product_confirm_dlg/summary/cost_lbl" ng-class="suggest_summary_value_class">{{product_to_add.get_suggest_main(\'cost\')|currency}}</p>' +
                    '</div>' +                                                            
                '</div>'
            ;               

            var template_detail = 
                '<label>Store count:{{product_to_add.get_sp_lst().length}}</label>' +
                '<table class="table table-hover table-bordered table-condensed table-striped">' + 
                    '<tr>' +
                        '<th>name</th>' +
                        '<th>price</th>' +
                        '<th>taxable</th>' +
                        '<th>crv</th>' +
                        '<th>cost</th>' +
                    '</tr>' +
                    '<tr ng-repeat="sp in product_to_add.get_sp_lst()">' +
                        '<td>{{sp.name}}</td>' +
                        '<td>{{sp.price | currency}}</td>' +
                        '<td class="alncenter"><span class="glyphicon" ng-class="sp.is_taxable ? \'glyphicon-check\' : \'glyphicon-unchecked\'"></span></td>' +
                        '<td>{{sp.get_crv()|currency}}</td>' +
                        '<td>{{sp.get_cost()|currency}}</td>' +
                    '</tr>' +
                '</table>'
            ;
            var template = 
                '<div id="sp_app/service/suggest/select_product_confirm_dlg" class="modal-header"><h3>confirm add product</h3></div>' +
                '<div class="modal-body">' +
                    '<div>' +
                        '<div class="col-md-5">' + template_summary + '</div>' +
                        '<div class="col-md-7">' + template_detail + '</div>' +
                        '<div class="clear"></div>' +
                    '</div>' +
                '</div>' +                
                '<div class="modal-footer">' +
                    '<button ng-click="select_product()" class="btn btn-primary btn-float-left">back</button>' +
                    '<button id="sp_app/service/suggest/select_product_confirm_dlg/ok_btn" ng-click="return_product()" class="btn btn-success">add product</button>' +
                    '<button ng-click="cancel()" class="btn btn-warning">cancel</button>' +
                '</div>'
            ;
            var ModalCtrl = function($scope,$modalInstance,product_to_add,product_lst,my_sp_lst,sku){
                $scope.product_to_add = product_to_add;
                $scope.suggest_summary_lbl_class = 'col-xs-4 control-label';
                $scope.suggest_summary_value_class = 'col-xs-8 form-control-static';
                $scope.cancel = function(){
                    $modalInstance.dismiss('_cancel_');
                }
                $scope.return_product = function(){
                    $modalInstance.close(product_to_add);
                }
                $scope.select_product = function(){
                    var select_product_service = $injector.get('sp_app/service/suggest/select_product')
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
            ModalCtrl.$inject = ['$scope','$modalInstance','product_to_add','product_lst','my_sp_lst','sku'];    
            var dlg = $modal.open({
                 template:template
                ,controller:ModalCtrl
                ,size:'lg'
                ,backdrop : 'static'
                ,resolve : {
                     product_to_add : function(){
                        return product_to_add;
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