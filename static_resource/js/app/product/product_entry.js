requirejs.config({
     baseUrl: STATIC_URL + 'js'
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        ,jquery: ['//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min', 'lib/jquery/jquery-1.11.0.min']
        ,jquery_ui: ['//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min', 'lib/jquery/jquery-ui-1.10.4.min']
        ,jquery_block_ui: ['//cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.66.0-2013.10.09/jquery.blockUI.min', 'lib/jquery/jquery.blockUI']
        ,bootstrap: ["//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min",'lib/bootstrap.min']
        ,angular:["//ajax.googleapis.com/ajax/libs/angularjs/1.2.18/angular.min",["lib/angular.min"]]
    }
    ,shim:{
         jquery_ui :{deps:["jquery"]}
        ,jquery_block_ui :{deps:["jquery"]}
        ,bootstrap: {deps:["jquery"]}
        ,angular : {'exports':'angular'}
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
    'app/product/product',
]
, function(app) {

});

