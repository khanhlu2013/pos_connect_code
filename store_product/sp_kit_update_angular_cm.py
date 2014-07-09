from store_product.models import Store_product,Kit_breakdown_assoc
from store_product.sp_couch import store_product_couch_getter
from store_product import sp_serializer
from couch import couch_util


def exe(kit,breakdown_assoc_lst):
    """
        PARAMS:
            .kit : sp
            .breakdown_assoc_lst: json
    """
    sp = exe_master(kit=kit,breakdown_assoc_lst=breakdown_assoc_lst)
    exe_couch(kit_pid=kit.product.id,store_id=kit.store.id,breakdown_assoc_lst=breakdown_assoc_lst)
    return sp


def exe_master(kit,breakdown_assoc_lst):
    """
        PARAMS:
            .kit : sp
            .breakdown_assoc_lst: json
    """    
    kit.breakdown_lst.clear()
    assoc_json_lst = breakdown_assoc_lst

    assoc_django_lst = []
    if len(assoc_json_lst) != 0:
        sp_django_db_lst = Store_product.objects.filter(store_id=kit.store.id,product_id__in=[assoc['breakdown']['product_id'] for assoc in assoc_json_lst])
        if len(sp_django_db_lst) != len(assoc_json_lst):
            raise Exception

        #we are creating assoc for django model which need the store_product.id, which the client did not provide(the client only provide pid). so we are finding the corresponding sp.id
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


def exe_couch(kit_pid,store_id,breakdown_assoc_lst):
    sp = store_product_couch_getter.exe(kit_pid,store_id)
    if len(breakdown_assoc_lst) == 0:
        sp['breakdown_assoc_lst'] = []
    else:
        sp['breakdown_assoc_lst'] = [{'breakdown_id':assoc['breakdown']['product_id'],'qty':assoc['qty']} for assoc in breakdown_assoc_lst]
    
    db = couch_util.get_store_db(store_id)
    db.save(sp)