var mod = angular.module('share.directive',[]);


mod.directive('ngEnter', function () {
    //need this to make text box work for enter key
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

mod.directive('blurMe', ['$timeout','$parse',function($timeout, $parse) {
    return {
        //scope: true,   // optionally create a child scope
        link: function(scope, element, attrs) {
            var model = $parse(attrs.blurMe);
            scope.$watch(model, function(value) {
                if(value === true) { 
                        $timeout(function() {
                        element[0].blur(); 
                    });
                }
            });
            // to address @blesh's comment, set attribute value to 'false'
            // on blur event:
            element.bind('focus', function() {
                if(model.assign !== undefined){
                  scope.$apply(model.assign(scope, false));
                }
            });
        }
    };
}]); 

mod.directive('focusMe', ['$timeout','$parse',function($timeout, $parse) {
    return {
        //scope: true,   // optionally create a child scope
        link: function(scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function(value) {
                if(value === true) { 
                    $timeout(function() {
                        element[0].focus(); 
                        if(element[0].select !== undefined){
                             element[0].select();
                        }
                    });
                }
            });
            // to address @blesh's comment, set attribute value to 'false'
            // on blur event:
            element.bind('blur', function() {
                if(model.assign !== undefined){
                    scope.$apply(model.assign(scope, false));
                }
            });
        }
    };
}]);  