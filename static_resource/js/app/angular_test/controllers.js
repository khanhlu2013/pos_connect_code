define(['angular'], function (angular) {
	'use strict';

	/* Controllers */
	
	var mod =  angular.module('myApp.controllers',[]);
	mod.controller('MyCtrl3',function(){
		this.message = 'hello world!';
	});
	return mod;
});