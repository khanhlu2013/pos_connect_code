({
     baseUrl: './js'
    ,name: "app/sale_app/config"
    ,out: "sale.min.js"
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        ,service : 'service'
        ,angular: 'lib/angular_3_18'

        // ,ui_bootstrap: 'lib/ui-bootstrap-tpls-0.11.0'
        ,ui_bootstrap: 'empty:'

        ,ngTable : 'lib/ng-table'
        ,pouchdb_raw :  'lib/pouchdb-3.0.6'
        ,blockUI : 'lib/angular-block-ui'
        ,angular_hotkey : 'lib/hotkeys'
    }
    ,shim:{
         angular              : { exports   : 'angular'}
        ,ui_bootstrap         : { deps      : ['angular']}
        ,ngTable              : { deps      : ['angular']} 
        ,blockUI              : { deps      : ['angular']} 
    }
})