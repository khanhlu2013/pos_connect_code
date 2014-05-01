define(
    [
        'lib/number/number'
    ]
    ,function
    (
        number
    )
{

    var ERROR_GROUP_VALIDATION_NAME = 'ERROR_GROUP_VALIDATION_NAME';

    function validate(result){

        var error_lst = new Array();
        var name = result.name;
        var group_child_sp_lst = result.group_child_sp_lst;

        if(!name || name.trim().length == 0){
            error_lst.push(ERROR_GROUP_VALIDATION_NAME);
        }
        
        return error_lst;
    }

    return{
         validate:validate
        ,ERROR_GROUP_VALIDATION_NAME:ERROR_GROUP_VALIDATION_NAME 
    }
});