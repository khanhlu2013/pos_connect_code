define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('service/date',[]);
    mod.factory('service/date/get_timezone_offset',function(){
    	return function(){
	    	return new Date().getTimezoneOffset() / 60;
    	}
	})
})