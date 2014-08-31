/**
* bootstraps angular onto the window.document node
*/
define([
    'require',
    'angular',
    'app/sale_app/app_2_test_offline/app'
], function (require, ng) {
    'use strict';
 
    require(['domReady!'], function (document) {
        ng.bootstrap(document, ['sale_app_offline']);
    });
});