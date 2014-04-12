define(
    [

    ],
    function
    (

    )
{
    return function (callback){
        $.ajax({
             url : "/sale_shortcut/get_data"
            ,type : "POST"
            ,dataType: "json"
            ,data : null
            ,success : function(data,status_str,xhr) {
                var parent_lst = data;
                callback(null/*error*/,parent_lst);
            }
            ,error : function(xhr,status_str,err) {
                callback(xhr);
            }
        });
    }
});