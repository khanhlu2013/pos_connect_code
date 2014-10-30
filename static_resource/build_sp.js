({
     baseUrl: './js'
    ,name: "sp_main"
    ,out: "sp.min.4.js"
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        ,service : 'service'
        
        ,angular: "lib/angular_3_18"
        // ,angular: "empty:"
        
        // ,ui_bootstrap: 'lib/ui-bootstrap-tpls-0.11.0.min'
        ,ui_bootstrap: 'empty:'
        ,jquery: 'lib/jquery-2.1.1'

        ,ngTable : 'lib/ng-table'
        // ,ngTable : 'empty:'

        ,pouchdb_raw : 'lib/pouchdb-3.0.6'
        // ,pouchdb_raw :  'empty:'
        
        ,infiniteScroll : 'lib/infinite-scroll'
        ,blockUI : 'lib/angular-block-ui'
        // ,blockUI : 'empty:'
    }
    ,shim:{
         angular              : { deps:['jquery'], exports : 'angular'}
        ,ui_bootstrap         : { deps      : ['angular']}
        ,ngTable              : { deps      : ['angular']} 
        ,blockUI              : { deps      : ['angular']} 
        ,infiniteScroll       : { deps      : ['angular','jquery']}
    }
})