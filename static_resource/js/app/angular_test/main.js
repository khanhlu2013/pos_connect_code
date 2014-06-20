require.config({
	paths: {
		angular: ['//ajax.googleapis.com/ajax/libs/angularjs/1.2.18/angular.min']
	},
	shim: {
		'angular' : {'exports' : 'angular'},
	},
	priority: [
		"angular"
	]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require( [
	'angular',
	'app',
], function(angular, app) {
	

	angular.element().ready(function() {
		angular.resumeBootstrap([app['name']]);
	});
});
