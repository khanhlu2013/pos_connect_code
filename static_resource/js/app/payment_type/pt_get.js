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
    function exe(callback){
        var ajax_b = ajax_helper.exe.bind(ajax_helper.exe,'/payment_type/get','GET','getting payment type ...',null/*data*/);
        async.waterfall([ajax_b],function(error,result){
            callback(error,result);
        });
    }

    return{
        exe:exe
    }
})
