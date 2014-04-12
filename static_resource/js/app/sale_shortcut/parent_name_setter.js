define(
    [

    ],
    function
    (

    )
{
    return function (name,position,callback){
        
        var data = {
             name:name
            ,position:position
        }        

        $.ajax({
             url : "/sale_shortcut/set_parent_name"
            ,type : "POST"
            ,dataType: "json"
            ,data : data
            ,success : function(data,status_str,xhr) {
                callback(null/*error*/);
            }
            ,error : function(xhr,status_str,err) {
                callback(xhr);
            }
        });
    }
});