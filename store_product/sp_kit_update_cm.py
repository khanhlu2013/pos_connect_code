from store_product.models import Store_product,Kit_breakdown_assoc
from store_product.sp_couch import store_product_couch_getter
from store_product import sp_serializer
from couch import couch_util


def exe(kit_id,store_id,breakdown_assoc_lst):
    """
        PARAMS:
            .kit_id : a pid for kit
            .breakdown_assoc_lst: a list of {breakdown_id(pid),qty}
    """
    sp_serialized = exe_master(kit_id=kit_id,store_id=store_id,breakdown_assoc_lst=breakdown_assoc_lst)
    exe_couch(kit_id=kit_id,store_id=store_id,breakdown_assoc_lst=breakdown_assoc_lst)
    return sp_serialized


def exe_master(kit_id,store_id,breakdown_assoc_lst):
    kit = Store_product.objects.get(product_id=kit_id,store_id=store_id)
    kit.breakdown_lst.clear()

    if len(breakdown_assoc_lst) == 0:
        return

    sp_django_db_lst = Store_product.objects.filter(store_id=store_id,product_id__in=[item['breakdown_id'] for item in breakdown_assoc_lst])
    if len(sp_django_db_lst) != len(breakdown_assoc_lst):
        raise Exception

    assoc_django_lst = []
    for db_json in breakdown_assoc_lst:
        breakdown_id = None
        for item in sp_django_db_lst:
            if item.product.id == db_json["breakdown_id"]:
                breakdown_id = item.id
                break;

        assoc = Kit_breakdown_assoc(kit_id=kit.id,breakdown_id=breakdown_id,qty=db_json["qty"])
        assoc_django_lst.append(assoc)

    Kit_breakdown_assoc.objects.bulk_create(assoc_django_lst)
    return sp_serializer.serialize_product_from_id(product_id=kit_id,store_id = store_id,is_include_other_store = False) #the reason i return a serialized product here have to do with infinite loop validation and master/couch transaction. if infinite loop occur(breakdown containing kit), serializing will failed here causing couch not to execute. If we exit exe_cm here without cauching infinite loop, couch will be exe and can not be roll back alter since there is no transaction for couch.


def exe_couch(kit_id,store_id,breakdown_assoc_lst):
    sp = store_product_couch_getter.exe(kit_id,store_id)
    sp['breakdown_assoc_lst'] = breakdown_assoc_lst
    
    db = couch_util.get_store_db(store_id)
    db.save(sp)