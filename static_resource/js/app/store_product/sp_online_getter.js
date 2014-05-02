define(
[
]
,function
(

)
{
    return function (product_id,is_include_other_store,is_lookup_type_tag,callback){
        $.ajax({
             url : '/product/search_by_pid'
            ,type : 'GET'
            ,dataType : 'json'
            ,data : {
                 'product_id':product_id
                ,'is_include_other_store':is_include_other_store
                ,'is_include_lookup_type_tag':is_lookup_type_tag
            }
            ,success : function(data,status_str,xhr){
                callback(null/*error*/,data);
            }
            ,error : function(xhr,status_str,err){
                callback(xhr);
            }
        });
    }
});