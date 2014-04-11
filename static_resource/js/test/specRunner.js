(function() {
    'use strict';

    // Configure RequireJS to shim Jasmine
    require.config({
        baseUrl: '../',
        paths: {
             'app'              : 'app'
            ,'lib'              : 'lib'         
            ,'spec'             : 'test/spec'   
            ,'jasmine'          : 'lib/jasmine-2.0.0/jasmine'
            ,'jasmine-html'     : 'lib/jasmine-2.0.0/jasmine-html'
            ,'mock-ajax'        : 'lib/jasmine-2.0.0/mock-ajax'
            ,'boot'             : 'lib/jasmine-2.0.0/boot'
            ,'pouch_db'         : 'lib/db/pouchdb-2.0.1'
            ,'jquery'           : 'lib/jquery/jquery-1_10_2'
            ,'jquery_block_ui'  : 'lib/jquery/jquery_blockUI'
            ,'jquery_ui'        : 'lib/jquery/jquery-ui'            
        },
        shim: {
            'jasmine': {
                exports: 'window.jasmineRequire'
            }
            ,'jasmine-html': {
                deps: ['jasmine'],
                exports: 'window.jasmineRequire'
            }
            ,'mock-ajax': {
                deps: ['jasmine', 'jasmine-html'],
                exports: 'window.jasmineRequire'
            }            
            ,'boot': {
                deps: ['jasmine', 'jasmine-html'],
                exports: 'window.jasmineRequire'
            }
            ,'pouch_db': {
                exports: 'Pouch_db'
            }
            ,'jquery_block_ui': ['jquery']
            ,'jquery_ui' : ['jquery']            
        }
    });

    // Define all of your specs here. These are RequireJS modules.
    var specs = [
        // 'spec/store_product/sp_updator_spec' -> pending spec
        // 'spec/store_product/sp_online_getter_spec'
        // 'spec/store_product/sp_online_updator_spec'
        // 'spec/store_product/sp_online_searcher_spec'        
        'spec/store_product/sp_online_creator_spec'        
    ];
               
    // Load Jasmine - This will still create all of the normal Jasmine browser globals unless `boot.js` is re-written to use the
    // AMD or UMD specs. `boot.js` will do a bunch of configuration and attach it's initializers to `window.onload()`. Because
    // we are using RequireJS `window.onload()` has already been triggered so we have to manually call it again. This will
    // initialize the HTML Reporter and execute the environment.
    require(['boot','mock-ajax','jquery_block_ui','jquery_ui'], function () {

        // Load the specs
        require(specs, function () {

          // Initialize the HTML Reporter and execute the environment (setup by `boot.js`)
          window.onload();
        });
    });
})();