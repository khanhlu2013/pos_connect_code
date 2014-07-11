define(
[
	'angular'
	//------
	,'app/store_product_angular_app/service/search'
]
,function
(
	angular
)
{
	var mod = angular.module('sp_app.sp.kit',['sp_app.search']);

    mod.factory('sp_app.sp.kit.prompt.service',['$modal','sp_app.search_dlg.service',function($modal,search_service){
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

    mod.factory('sp_app.sp.kit.edit.service',['$modal','sp_app.sp.kit.prompt.service',function($modal,prompt_service){
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
                var promise = prompt_service(assoc);
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
                var promise = prompt_service(null);
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
})