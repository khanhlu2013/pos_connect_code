requirejs.config({
     baseUrl: STATIC_URL + 'js'
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        ,service : 'service'
        // ,angular:["//ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.18/angular.min",["lib/angular_3_18.min"]]
        ,angular:["lib/angular_3_18"]

        ,ui_bootstrap:["//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.11.0/ui-bootstrap-tpls.min",["lib/ui-bootstrap-tpls-0.11.0.min"]]
        // ,ui_bootstrap:['lib/ui-bootstrap-tpls-0.11.0']

        ,ngTable :                ['lib/ng-table']
        ,pouchdb_raw :            ['lib/pouchdb-3.0.6']
        ,pouchdb_quick_search :   ['lib/pouchdb.quick-search']
        ,blockUI :                ['lib/angular-block-ui']
        ,angular_hotkey :         ['lib/hotkeys']
    }
    ,shim:{
         'angular'                  : { exports : 'angular' }
        ,'ui_bootstrap'             : { deps    : ['angular'] }
        ,'angular_hotkey'           : { deps    : ['angular'] }
        ,'ngTable'                  : { deps    : ['angular'] } 
        ,'pouchdb_quick_search'     : { deps    : ['pouchdb_raw'] } 
        ,'blockUI'                  : { deps    : ['angular']}         
    }
});

require([
    'angular',
    'app/sale_app/app'
], function (angular) {
    'use strict';

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['sale_app']);
    });  

});