// Karma configuration
// Generated on Sun Jan 25 2015 09:30:01 GMT-0800 (PST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [    
        'static/bower_components/jquery/dist/jquery.js',       
        'static/bower_components/angular/angular.js',
        'static/bower_components/angular-mocks/angular-mocks.js',
        'static/bower_components/angular-block-ui/dist/angular-block-ui.js',
        'static/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'static/bower_components/bootstrap/dist/js/bootstrap.js',
        'static/bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',   
        'static/src/**/__init__.js',
        'static/src/**/*.js',
        'test/unit/mock/app/product_app/init_share_setting.js',        
        'test/unit/**/*.js'
    ],

    // list of files to exclude
    exclude: [
        'static/src/app/product_app/init_share_setting.js',        
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
