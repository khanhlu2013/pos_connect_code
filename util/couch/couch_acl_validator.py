from util.couch import master_account_util

REGULAR_USER_PERFORM_DELETE_IS_NOT_ALLOW = 'regular user perform delete is not allow'
REGULAR_USER_PERFORM_INSERT_DOCUMENT_OTHER_THAN_RECEIPT_IS_NOT_ALLOW = 'regular user perform insert document other than receipt is not allow'
REGULAR_USER_PERFORM_UPDATE_IS_NOT_ALLOW = 'regular user perform update is not allow'

src = """function(newDoc, oldDoc, userCtx, secObj){
    /*
        Algorithm:  authorization of user's request to couch_server is based on the account user name. If the user
                    is the Client, we can only do insert and read. Only Master can create and update.
    */
    if(userCtx.name.localeCompare('%s') == 0){
        if(newDoc._deleted){
            return;//admin perform delete is allow
        }
        else if(oldDoc != null){
            return;//admin perform update is allow
        }
        else {
            return;//admin perform insert or update is allow
        }
    }else if(newDoc._deleted){
        throw({ unauthorized: '%s' });
    }
    else if(oldDoc != null){
        throw({ unauthorized: '%s' });
    }
    else if(newDoc.d_type == 'receipt'){
        return;//regular user perform insert receipt is allow
    }else{
        throw({ unauthorized: '%s' });
    }
}
""" % (master_account_util.get_master_user_name()
    ,REGULAR_USER_PERFORM_DELETE_IS_NOT_ALLOW
    ,REGULAR_USER_PERFORM_UPDATE_IS_NOT_ALLOW
    ,REGULAR_USER_PERFORM_INSERT_DOCUMENT_OTHER_THAN_RECEIPT_IS_NOT_ALLOW )