var app = angular.module('app.saleApp');
app.requires.push.apply(app.requires,[
    'share.ui'
]);
app.controller('app.saleApp.controller',
[
    '$scope',
    'app.saleApp.init_db',
    'share.ui.alert',
function(
    $scope,
    init_db,
    alert_service
){
    $scope.message = 'hello world from sale app!';
    init_db().then(
        function(){

        },function(reason){
            alert_service(reason);
        }
    )
}]);