define(
    [
        'lib/number/number'
    ]
    ,function
    (
        number
    )
{
    var ERROR_GROUP_ACTION_VALIDATION_PRICE = 'ERROR_GROUP_ACTION_VALIDATION_PRICE';
    var ERROR_GROUP_ACTION_VALIDATION_CRV = 'ERROR_GROUP_ACTION_VALIDATION_CRV';
    var ERROR_GROUP_ACTION_VALIDATION_IS_TAXABLE = 'ERROR_GROUP_ACTION_VALIDATION_IS_TAXABLE';
    var ERROR_GROUP_ACTION_VALIDATION_IS_SALE_REPORT = 'ERROR_GROUP_ACTION_VALIDATION_IS_SALE_REPORT';
    var ERROR_GROUP_ACTION_VALIDATION_P_TYPE = 'ERROR_GROUP_ACTION_VALIDATION_P_TYPE';
    var ERROR_GROUP_ACTION_VALIDATION_P_TAG = 'ERROR_GROUP_ACTION_VALIDATION_P_TAG';
    var ERROR_GROUP_ACTION_VALIDATION_VENDOR = 'ERROR_GROUP_ACTION_VALIDATION_VENDOR';
    var ERROR_GROUP_ACTION_VALIDATION_COST = 'ERROR_GROUP_ACTION_VALIDATION_COST';
    var ERROR_GROUP_ACTION_VALIDATION_BUYDOWN = 'ERROR_GROUP_ACTION_VALIDATION_BUYDOWN';
    var ERROR_GROUP_ACTION_VALIDATION_EMPTY_ACTION = 'ERROR_GROUP_ACTION_VALIDATION_EMPTY_ACTION';

    function validate(result){

        var error_lst = new Array();

        var price = result.price;
        var crv = result.crv;
        var is_taxable = result.is_taxable;
        var is_sale_report = result.is_sale_report;
        var p_type = result.p_type;
        var p_tag = result.p_tag;
        var vendor = result.vendor;
        var cost = result.cost;
        var buydown = result.buydown;

        if(!price && !crv && !is_taxable && !is_sale_report && !p_type && !p_tag && !vendor && !cost && !buydown){
            error_lst.push(ERROR_GROUP_ACTION_VALIDATION_EMPTY_ACTION);
        }
        if(price != null && price != undefined && typeof(price) == 'string' && price.trim().length != 0 && !number.is_positive_double(price)){
            error_lst.push(ERROR_GROUP_ACTION_VALIDATION_PRICE);
        }
        if(crv != null && crv != undefined && typeof(crv) == 'string' && crv.trim().length != 0 && !number.is_positive_double(crv)){
            error_lst.push(ERROR_GROUP_ACTION_VALIDATION_CRV);
        }
        if(is_taxable != null && is_taxable != undefined && typeof(is_taxable) == 'string' && is_taxable.trim().length != 0 && (is_taxable != 'true' && is_taxable != 'false')){
            error_lst.push(ERROR_GROUP_ACTION_VALIDATION_IS_TAXABLE);
        }        
        if(is_sale_report != null && is_sale_report != undefined && typeof(is_sale_report) == 'string' && is_sale_report.trim().length != 0 && (is_sale_report != 'true' && is_sale_report != 'false')){
            error_lst.push(ERROR_GROUP_ACTION_VALIDATION_IS_SALE_REPORT);
        }       
   
        if(cost != null && cost != undefined && typeof(cost) == 'string' && cost.trim().length != 0 && !number.is_positive_double(cost)){
            error_lst.push(ERROR_GROUP_ACTION_VALIDATION_COST);
        }
        if(buydown != null && buydown != undefined && typeof(buydown) == 'string' && buydown.trim().length != 0 && !number.is_positive_double(buydown)){
            error_lst.push(ERROR_GROUP_ACTION_VALIDATION_BUYDOWN);
        }   

        return error_lst;
    }

    return{
         validate:validate
        ,ERROR_GROUP_ACTION_VALIDATION_PRICE:ERROR_GROUP_ACTION_VALIDATION_PRICE 
        ,ERROR_GROUP_ACTION_VALIDATION_CRV:ERROR_GROUP_ACTION_VALIDATION_CRV
        ,ERROR_GROUP_ACTION_VALIDATION_IS_TAXABLE:ERROR_GROUP_ACTION_VALIDATION_IS_TAXABLE
        ,ERROR_GROUP_ACTION_VALIDATION_IS_SALE_REPORT:ERROR_GROUP_ACTION_VALIDATION_IS_SALE_REPORT
        ,ERROR_GROUP_ACTION_VALIDATION_P_TYPE:ERROR_GROUP_ACTION_VALIDATION_P_TYPE
        ,ERROR_GROUP_ACTION_VALIDATION_P_TAG:ERROR_GROUP_ACTION_VALIDATION_P_TAG
        ,ERROR_GROUP_ACTION_VALIDATION_VENDOR:ERROR_GROUP_ACTION_VALIDATION_VENDOR
        ,ERROR_GROUP_ACTION_VALIDATION_COST:ERROR_GROUP_ACTION_VALIDATION_COST
        ,ERROR_GROUP_ACTION_VALIDATION_BUYDOWN:ERROR_GROUP_ACTION_VALIDATION_BUYDOWN
        ,ERROR_GROUP_ACTION_VALIDATION_EMPTY_ACTION:ERROR_GROUP_ACTION_VALIDATION_EMPTY_ACTION
    }
});


