from util.couch import master_account_util

src = """function(newDoc, oldDoc, userCtx, secObj){
    /*
        Algorithm:  authorization of user's request to couch_server is based on the account user name. If the user
                    is the Client, we can only do insert and read. Only Master can create and update.
    */
    if(userCtx.name.localeCompare('%s') == 0){
        return;//admin is allow any operation
    }
    else{
        throw({ unauthorized: 'regular user is not allow any operation'});
    }
}
""" % (master_account_util.get_master_user_name(),)