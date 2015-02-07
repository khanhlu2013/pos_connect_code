var mod = angular.module('app.productApp');
mod.requires.push.apply(mod.requires,[
    'share.util.construct_share_setting'
])

mod.value('share_setting',_GLOBAL_SETTING_);
mod.run(
[
    'share.util.construct_share_setting',
    'share_setting',
function(
    construct_share_setting,
    share_setting
){
    var constructed_share_setting = construct_share_setting(share_setting);
    for(var k in constructed_share_setting) 
        share_setting[k]=constructed_share_setting[k];
}]) ;
