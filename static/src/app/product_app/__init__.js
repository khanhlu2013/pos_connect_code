var app = angular.module('app.productApp', [
    'share.util.csrf',
    'share.filter',
    'share.directive',
    'ui.bootstrap'
])

app.config(['$sceDelegateProvider',function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // 'http://127.0.0.1:8000/*', //i think i need this when i am dealing with partial? (the network product partial)
        // Allow loading from our assets domain.  Notice the difference between * and **.
        // 'https://liquorkhanhlu2013.s3.amazonaws.com/**'
    ]);
}]);


