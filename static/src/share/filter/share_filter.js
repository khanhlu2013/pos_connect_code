var mod = angular.module('share.filter', []);

mod.filter('not_show_zero', function () {
    return function(input) {
        if(input === '$0.00'){
            return "";
        }
        else if(input === '0'){
            return "";
        }
        else if(input === 0){
            return "";
        }
        else{
            return input
        }
    };
});    

mod.filter("emptyToEnd", function () {
    return function (array, key) {
        if (!angular.isArray(array)) return;
        var present = array.filter(function (item) {
            if(key.indexOf('()') != -1){
                return item[key.replace('()','')]();
            }else{
                return item[key];    
            }
        });
        var empty = array.filter(function (item) {
            if(key.indexOf('()') != -1){
                return !item[key.replace('()','')]();
            }else{
                return !item[key];    
            }
        });
        return present.concat(empty);
    };
});