({
     baseUrl: './js'
    ,name: "app/sp_app/config"
    ,out: "sp.min.js"
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        ,service : 'service'
        
        ,angular: "lib/angular_3_18"
        // ,angular: "empty:"
        
        // ,ui_bootstrap: 'lib/ui-bootstrap-tpls-0.11.0.min'
        ,ui_bootstrap: 'empty:'

        ,ngTable : 'lib/ng-table'
        // ,ngTable : 'empty:'

        ,pouchdb_raw :  'lib/pouchdb-3.0.6'
        // ,pouchdb_raw :  'empty:'
        
        ,blockUI : 'lib/angular-block-ui'
        // ,blockUI : 'empty:'
    }
    ,shim:{
         angular              : { exports   : 'angular'}
        ,ui_bootstrap         : { deps      : ['angular']}
        ,ngTable              : { deps      : ['angular']} 
        ,blockUI              : { deps      : ['angular']} 
    }
})