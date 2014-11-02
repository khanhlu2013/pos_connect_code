({
     baseUrl: './js'
    ,name: "sp_main"
    ,out: "sp.min.4.js"
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        ,service : 'service'
        
        ,angular: "lib/angular_3_18"
        ,ui_bootstrap: 'empty:'
        ,jquery: 'lib/jquery-2.1.1'
        ,ngTable : 'lib/ng-table'
        ,pouchdb_raw : 'lib/pouchdb-3.0.6'
        ,infiniteScroll : 'lib/infinite-scroll'
        ,blockUI : 'lib/angular-block-ui'
    }
    ,shim:{
         angular              : { deps:['jquery'], exports : 'angular'}
        ,ui_bootstrap         : { deps      : ['angular']}
        ,ngTable              : { deps      : ['angular']} 
        ,blockUI              : { deps      : ['angular']} 
        ,infiniteScroll       : { deps      : ['angular','jquery']}
    }
})