requirejs.config({
     baseUrl: STATIC_URL + 'js'
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        ,service : 'service'
        ,controller : 'controller'


        // ,angular:["//ajax.googleapis.com/ajax/libs/angularjs/1.2.18/angular",["lib/angular.min"]]
        ,angular:["lib/angular"]

        // ,ui_bootstrap:["//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls.min",["lib/ui-bootstrap-tpls-0.11.0"]]
        ,ui_bootstrap:["lib/ui-bootstrap-tpls-0.11.0"]
    }
    ,shim:{
         angular : {'exports':'angular'}
        ,ui_bootstrap : {deps:["angular"]/*,'exports':'ui_bootstrap'*/}
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
    'app/sp_app/app'
]
, function(app) {
    angular.element().ready(function() {
        angular.resumeBootstrap([app['name']]);
    });    
});

