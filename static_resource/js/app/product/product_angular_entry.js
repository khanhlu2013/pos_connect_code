requirejs.config({
     baseUrl: STATIC_URL + 'js'
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        ,angular:["//ajax.googleapis.com/ajax/libs/angularjs/1.2.18/angular.min",["lib/angular.min"]]
    }
    ,shim:{
        angular : {'exports':'angular'}
    }
});
requirejs.onError = function (err) {
    alert('there is error loading page: ' + err.requireType);
    throw err;
};
//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require( 
[
    'app/product/product_angular'
]
, function(app) {
    angular.element().ready(function() {
        angular.resumeBootstrap([app['name']]);
    });    
});

