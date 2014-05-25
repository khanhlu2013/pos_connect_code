define(
[
     'lib/error_lib'
    ,'lib/async'
    ,'lib/ajax_helper'

]
,function
(
     error_lib
    ,async
    ,ajax_helper
)
{
    function exe(name,callback){
        var ajax_b = ajax_helper.exe.bind(ajax_helper.exe,'/payment_type/insert','POST','inserting payment type ...',{name:name});
        async.waterfall([ajax_b],function(error,result){
            callback(error,result);
        });
    }

    return{
        exe:exe
    }
})