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
            ,success : function(data) {
                callback(null/*error*/);
            }
            ,error : function(xhr,errmsg,err) {
                var error = xhr.status + ": " + xhr.responseText;
                callback(error)
            }
        });
    }
});