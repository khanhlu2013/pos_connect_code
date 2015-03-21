from store_product.models import Store_product,Kit_breakdown_assoc
from store_product import dao_couch
from store_product import sp_serializer
from util import couch_db_util


def exe(kit_product_id,assoc_json_lst,store_id):
    """
       assoc_json_lst: {kit,breakdown,qty}
    """    
    #verify kit belong to this store
    kit = Store_product.objects.get(product_id=kit_product_id,store_id=store_id)

    #verify breakdown list belong to this store
    if len(assoc_json_lst) > 0:
        bd_django_lst = Store_product.objects.filter(store_id=store_id,product_id__in=[assoc['breakdown']['product_id'] for assoc in assoc_json_lst])
        if len(bd_django_lst) != len(assoc_json_lst):
            raise Exception

    sp = exe_master(kit=kit,assoc_json_lst=assoc_json_lst)
    exe_couch(kit_pid=kit.product.id,store_id=store_id,assoc_json_lst=assoc_json_lst)
    return sp


def exe_master(kit,assoc_json_lst):
    """
       assoc_json_lst: {kit,breakdown,qty}
    """    
    kit.breakdown_lst.clear()
    if len(assoc_json_lst) != 0:
        #we are creating assoc for django model which need the store_product.id(breakdown_id), which the client did not provide(the client only provide pid). so we are finding the corresponding sp.id from pid       
        assoc_django_lst = []
        sp_django_db_lst = Store_product.objects.filter(store_id=kit.store.id,product_id__in=[assoc['breakdown']['product_id'] for assoc in assoc_json_lst])
        if len(sp_django_db_lst) != len(assoc_json_lst):
            raise Exception
        for assoc_json in assoc_json_lst:
            breakdown_id = None
            for item in sp_django_db_lst:
                if item.product.id == assoc_json["breakdown"]["product_id"]:
                    breakdown_id = item.id
                    break;

            assoc = Kit_breakdown_assoc(kit_id=kit.id,breakdown_id=breakdown_id,qty=assoc_json["qty"])
            assoc_django_lst.append(assoc)
        Kit_breakdown_assoc.objects.bulk_create(assoc_django_lst)
    return kit


def exe_couch(kit_pid,store_id,assoc_json_lst):
    """
       assoc_json_lst: {kit,breakdown,qty}
    """        
    sp = dao_couch.get_item(kit_pid,store_id)

    if len(assoc_json_lst) == 0:
        sp['breakdown_assoc_lst'] = []
    else:
        sp['breakdown_assoc_lst'] = [{'product_id':assoc['breakdown']['product_id'],'qty':assoc['qty']} for assoc in assoc_json_lst]
    
    db = couch_db_util.get_store_db(store_id)
    db.save(sp)