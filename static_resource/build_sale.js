({
     baseUrl: './js'
    ,name: "sale_main"
    ,out: "sale.min.6.js"
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        ,service : 'service'
        
        ,angular: 'lib/angular_3_18'
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