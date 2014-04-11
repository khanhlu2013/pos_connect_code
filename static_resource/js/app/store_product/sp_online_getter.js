define(
[
]
,function
(

)
{
    return function (product_id,is_include_other_store,is_lookup_type_tag,callback){
        $.ajax({
             url : '/product/getter_ajax'
            ,type : 'GET'
            ,dataType : 'json'
            ,data : {
                 'product_id':product_id
                ,'is_include_other_store':is_include_other_store
                ,'is_include_lookup_type_tag':is_lookup_type_tag
            }
            ,success : function(result){
                callback(null/*error*/,result);
            }
            ,error : function(xhr,errmsg,error){
                callback('there is error');
            }
        });
    }
});