define(['angular'], function (angular) 
{
    'use strict';

    var filter_mod = angular.module('filter', []);

    filter_mod.filter('not_show_zero', function () {
        return function(input) {
            if(input == '$0.00'){
                return "";
            }else{
                return input
            }
        };
    });    
});