// /**
// * bootstraps angular onto the window.document node
// */
// define([
//     'require',
//     'angular',
//     'app/sp_app/app',
//     'domReady'
// ], function (require, ng) {
//     'use strict';
 
//     require(['domReady!'], function (document) {
//         ng.bootstrap(document, ['store_product_app']);
//     });
// });


// //working version -> its perfect
// define([
//     'require',
//     'angular',
//     'app/sp_app/app',
//     'domReady'    
// ], function (require, angular) {

//     require(['domReady!'], function (document) {
//         angular.element(document).ready(function() {
//             // window.name='NG_DEFER_BOOTSTRAP! Hello World!';
//             // window.document.body.setAttribute('ng-app', '');
//             angular.bootstrap(document, ['store_product_app']);
//         });    
//     });
// });


define([
    'require',
    'angular',
    'app/sp_app/app',
], function (require, angular) {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['store_product_app']);
    });   
});