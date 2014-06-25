from couch import couch_util,couch_constance

def exe(product_id,store_id):
    """
        RETURN
            . a document inside couchdb with product_id and store_id
    """
    db = couch_util.get_store_db(store_id)
    view_name = couch_util._get_full_view_name(couch_constance.STORE_DB_VIEW_NAME_BY_PRODUCT_ID)
    key = int(product_id)
    view_result = db.view(view_name)[key]
    rows = view_result.rows

    if len(rows) > 1:
        raise MultipleObjectsReturned
    elif len(rows) == 0:
        return None
    else: return rows[0].value


def get_lst_old(pid_lst,store_id):
    result = []

    db = couch_util.get_store_db(store_id)
    view_name = couch_util._get_full_view_name(couch_constance.STORE_DB_VIEW_NAME_BY_PRODUCT_ID)
    view_result = db.view(view_name)

    for row in view_result:
        if row.value['product_id'] in pid_lst:
            result.append(row.value)

    return result

def get_lst(pid_lst,store_id):
    db = couch_util.get_store_db(store_id)
    view_name = couch_util._get_full_view_name(couch_constance.STORE_DB_VIEW_NAME_BY_PRODUCT_ID)
    rows = db.view(view_name,keys=pid_lst,include_docs=True)

    result = [row.doc for row in rows]
    return result