/*
    I could have include this file in the main app file. However, i factor this code out so i can exclude it from karma. WHY? 
    because _GLOBAL_SETTING_ is a constance passing down from the server in the html. This variable is not available in karma
    environment
*/
var mod = angular.module('app.saleApp');
mod.requires.push.apply(mod.requires,[
    'app.construct_app_setting'
])

mod.value('share_setting',_GLOBAL_SETTING_);
mod.run(
[
    'app.construct_app_setting',
    'share_setting',
function(
    construct_app_setting,
    share_setting
){
    var constructed_share_setting = construct_app_setting(share_setting);
    for(var k in constructed_share_setting) 
        share_setting[k]=constructed_share_setting[k];
}]);