var mod = angular.module('share.validation.number',[]);
mod.directive('validFloat',function(){
    /*
        only model is not null and is not contain white space, this validation directive will kick in 
    */
    return{
        restrict: 'A',
        require: 'ngModel',
        link: function($scope,$element,$attrs,ngModelCtrl){
            
            var validator = function(value,condition){
                /*
                    pre-requisite: value is not null and value is not contain white space only
                */
                value = value.trim();
                if(isNaN(value)){
                    return false;
                }                

                //by now, value is a number. we init a few thing
                var valid = true;
                var value = Number(value);
                var condition = $attrs['validFloat'];
                
                //if there is no extra condition, it is valid
                if(condition === ''){
                    return true;
                }
                
                //check extra condition
                if(condition === 'gt0'){
                    if(value > 0){
                        return true;
                    }else{
                        return false;
                    }
                }else if(condition === 'gte0'){
                    if(value >= 0){
                        return true;
                    }else{
                        return false;
                    }
                }
                else{
                     return false;
                }
            }
            ngModelCtrl.$parsers.unshift(function(value){
                //value comming from the html ui. we are cleaning it up to pass into the controller
                if(value === null/*we never happen. value at most will be empty string*/ || value.trim().length === 0){
                    ngModelCtrl.$setValidity('validFloat',true);
                    return null;//however due to an unknown reason, the null is not return into the model. instead, the model.property will be deleted. we need more investigate
                }else{
                    var valid = validator(value);
                    ngModelCtrl.$setValidity('validFloat',valid);
                    return valid ? Number(value) : undefined;                    
                }
                // var valid = validator(value);
                // ngModelCtrl.$setValidity('validFloat',valid);
                // return valid ? Number(value) : undefined;                      
            });

            ngModelCtrl.$formatters.unshift(function(value){
                //value is comming from the controller, we are formatting it up to pass it into the ui
                if(value === null || value.trim().length === 0){
                    ngModelCtrl.$setValidity('validFloat',true);
                }else{
                    ngModelCtrl.$setValidity('validFloat',validator(value));
                }
                return value  
            })
        }
    }
});