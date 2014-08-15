requirejs.config({
     baseUrl: STATIC_URL + 'js'
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        ,service : 'service'
        ,controller : 'controller'
        ,domReady: ['lib/require/domReady']

        // ,angular:["//ajax.googleapis.com/ajax/libs/angularjs/1.2.18/angular",["lib/angular.min"]]
        ,'angular':["lib/angular"]

        // ,ui_bootstrap:["//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls.min",["lib/ui-bootstrap-tpls-0.11.0"]]
        ,'ui_bootstrap':['lib/ui-bootstrap-tpls-0.11.0']

        ,'ngTable' : ['lib/ng-table']
        ,'pouchdb_raw' : ['lib/pouchdb-3.0.0.min']
    }
    ,shim:{
         'angular'              : { exports:'angular'}
        ,'ui_bootstrap'         : { deps:['angular']/*,'exports':'ui_bootstrap'*/}
        ,'ngTable'              : { deps : ['angular']} 
        ,'angular_raw'          : { exports:'PouchDB'}
    }
    ,deps : ['app/sale_app/bootstrap']
});
requirejs.onError = function (err) {
    alert('there is error loading page: ' + err);
    console.log(err);
    throw err;
};