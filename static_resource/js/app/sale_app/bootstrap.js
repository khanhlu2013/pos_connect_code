/**
* bootstraps angular onto the window.document node
*/
define([
	'require',
	'angular',
	'app/sale_app/app'
], function (require, ng) {
	'use strict';
 
    require(['domReady!'], function (document) {
        ng.bootstrap(document, ['sale_app']);
 	});
});