define(
[
     'lib/async'
]
,function
(
     async
)
{
    function exe(id,callback){

        $.ajax({
             url : "/mix_match/delete"
            ,type : "POST"
            ,dataType: "json"
            ,data : {id:id}
            ,success : function(data,status_str,xhr) {
                callback(null,data);
            }
            ,error : function(xhr,status_str,err) {
                callback(xhr);
            }
        });
    }

    return {
         exe:exe
    }
});