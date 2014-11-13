({
     baseUrl: './js'
    ,name: "sale_main"
    ,out: "sale.min.10.js"
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        ,service : 'service'
        
        ,angular: 'lib/angular_3_18'
        ,ui_bootstrap: 'empty:'
        ,jquery: 'lib/jquery-2.1.1'
        ,ngTable : 'lib/ng-table'
        ,pouchdb_raw :  'lib/pouchdb-3.0.6'
        ,blockUI : 'lib/angular-block-ui'
        ,infiniteScroll : 'lib/infinite-scroll'
        ,angular_mock : 'lib/angular-mocks'
        ,angular_hotkey : 'lib/hotkeys'
    }
    ,shim:{
         angular              : { deps:['jquery'], exports : 'angular'}
        ,ui_bootstrap         : { deps      : ['angular']}
        ,angular_mock         : { deps      : ['angular'] }        
        ,ngTable              : { deps      : ['angular']} 
        ,blockUI              : { deps      : ['angular']} 
        ,infiniteScroll       : { deps      : ['angular','jquery']}
    }
})