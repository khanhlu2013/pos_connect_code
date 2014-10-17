({
     baseUrl: './js'
    ,name: "app/sp_app/config"
    ,out: "sp.min.js"
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        ,service : 'service'
        ,angular: "lib/angular_3_18.min"
        ,ui_bootstrap: 'lib/ui-bootstrap-tpls-0.11.0.min'
        ,ngTable : 'lib/ng-table'
        ,pouchdb_raw :  'lib/pouchdb-3.0.6'
        ,blockUI : 'lib/angular-block-ui'
    }
    ,shim:{
         angular              : { exports   : 'angular'}
        ,ui_bootstrap         : { deps      : ['angular']}
        ,ngTable              : { deps      : ['angular']} 
        ,blockUI              : { deps      : ['angular']} 
    }
})