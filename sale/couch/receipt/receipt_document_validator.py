from django.conf import settings
from util.couch import master_account_util,couch_constance

ERROR_REQUIRE_TIME_STAMP = 'ERROR_REQUIRE_TIME_STAMP'
ERROR_REQUIRE_COLLECT_AMOUNT = 'ERROR_REQUIRE_COLLECT_AMOUNT'
ERROR_REQUIRE_DS_LST = 'ERROR_REQUIRE_DS_LST'
ERROR_REQUIRE_TAX_RATE = 'ERROR_REQUIRE_TAX_RATE'
ERROR_RECEIPT_LN_EMPTY = 'ERROR_RECEIPT_LN_EMPTY'
ERROR_RECEIPT_LN_QTY = 'ERROR_RECEIPT_LN_QTY'
ERROR_RECEIPT_LN_STORE_PRODUCT = 'ERROR_RECEIPT_LN_STORE_PRODUCT'
ERROR_RECEIPT_LN_PRICE = 'ERROR_RECEIPT_LN_PRICE'
ERROR_RECEIPT_LN_DISCOUNT = 'ERROR_RECEIPT_LN_DISCOUNT'
ERROR_RECEIPT_LN_NON_PRODUCT_NAME = 'ERROR_RECEIPT_LN_NON_PRODUCT_NAME'


src = """function(newDoc, oldDoc, userCtx, secObj){
        /*
            Algorithm:  authorization of user's request to couch_server is based on the account user name. If the user
                        is the Client, we can only do insert and read. Only Master can create and update.
        */
        if(newDoc.d_type === '%s'){
            var error_lst = new Array();

            if(newDoc.collected_amount == null){
                error_lst.push('%s');
            }

            if(newDoc.ds_lst == null){
                error_lst.push('%s');
            }else{
                if(newDoc.ds_lst.length == 0){
                    error_lst.push('%s');
                }else{
                    for(var i = 0;i<newDoc.ds_lst.length;i++){
                        var receipt_ln_error_lst = validate_receipt_ln(newDoc.ds_lst[i]);
                        if(receipt_ln_error_lst.length != 0){
                            error_lst.push.apply(error_lst, receipt_ln_error_lst)
                            break;
                        }
                    }            
                }            
            }

            if(newDoc.tax_rate == null){
                error_lst.push('%s');
            }

            if(newDoc.time_stamp == null){
                error_lst.push('%s');
            }           

            if(error_lst.length!=0){
                var message = "";
                for(var i = 0;i<error_lst.length;i++){
                    message += (' ' + error_lst[i])
                }
                throw({forbidden: message});
            } 
        }
    }

    function validate_receipt_ln(ln){
        var error_lst = new Array();

        if(ln.qty == null){
            error_lst.push('%s');
        }

        if(ln.store_product === undefined){
            error_lst.push('%s');
        }

        if(ln.price == null){
            error_lst.push('%s');
        }

        if(ln.discount === undefined){
            error_lst.push('%s');
        }

        if(ln.non_product_name === undefined){
            error_lst.push('%s');
        }

        return error_lst;
    }""" % (
         couch_constance.RECEIPT_DOCUMENT_TYPE
        ,ERROR_REQUIRE_COLLECT_AMOUNT
        ,ERROR_REQUIRE_DS_LST
        ,ERROR_RECEIPT_LN_EMPTY
        ,ERROR_REQUIRE_TAX_RATE
        ,ERROR_REQUIRE_TIME_STAMP
        ,ERROR_RECEIPT_LN_QTY
        ,ERROR_RECEIPT_LN_STORE_PRODUCT
        ,ERROR_RECEIPT_LN_PRICE
        ,ERROR_RECEIPT_LN_DISCOUNT
        ,ERROR_RECEIPT_LN_NON_PRODUCT_NAME
    )
