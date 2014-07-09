from store_product.models import Store_product,Kit_breakdown_assoc
from store_product.sp_couch import store_product_couch_getter
from store_product import sp_serializer
from couch import couch_util


def exe(kit_id,store_id,assoc_json_lst):
    """
        PARAMS:
            .kit_id : a pid for kit
            .assoc_json_lst: a list of {breakdown_id(pid),qty}
    """
    sp_serialized = exe_master(kit_id=kit_id,store_id=store_id,assoc_json_lst=assoc_json_lst)
    exe_couch(kit_id=kit_id,store_id=store_id,assoc_json_lst=assoc_json_lst)
    return sp_serialized


def exe_master(kit_id,store_id,assoc_json_lst):
    kit = Store_product.objects.get(product_id=kit_id,store_id=store_id)
    kit.breakdown_lst.clear()

    assoc_django_lst = []
    if len(assoc_json_lst) != 0:
        #check assoc_json_lst containing valid sp in this store
        sp_django_db_lst = Store_product.objects.filter(store_id=store_id,product_id__in=[item['breakdown_id'] for item in assoc_json_lst])
        if len(sp_django_db_lst) != len(assoc_json_lst):
            raise Exception

        #we are creating assoc for django model which need the store_product.id, which the client did not provide(the client only provide pid). so we are finding the corresponding sp.id
        for assoc_json in assoc_json_lst:
            breakdown_id = None
            for item in sp_django_db_lst:
                if item.product.id == assoc_json["breakdown_id"]:
                    breakdown_id = item.id
                    break;

            assoc = Kit_breakdown_assoc(kit_id=kit.id,breakdown_id=breakdown_id,qty=assoc_json["qty"])
            assoc_django_lst.append(assoc)
        Kit_breakdown_assoc.objects.bulk_create(assoc_django_lst)

    product_serialized =  sp_serializer.serialize_product_from_id(product_id=kit_id,store_id = store_id,is_include_other_store = False) #the reason i return a serialized product here have to do with infinite loop validation and master/couch transaction. if infinite loop occur(breakdown containing kit), serializing will failed here causing couch not to execute. If we exit exe_cm here without cauching infinite loop, couch will be exe and can not be roll back alter since there is no transaction for couch.
    return product_serialized


def exe_couch(kit_id,store_id,assoc_json_lst):
    sp = store_product_couch_getter.exe(kit_id,store_id)
    sp['breakdown_assoc_lst'] = assoc_json_lst
    
    db = couch_util.get_store_db(store_id)
    db.save(sp)