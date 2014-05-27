from store_product.models import Store_product
from store_product.sp_couch import store_product_couch_getter
from couch import couch_util


def exe(product_id,store_id,sp_lst):
    exe_master(product_id=product_id,store_id=store_id,sp_lst=sp_lst)
    exe_couch(product_id=product_id,store_id=store_id,sp_lst=sp_lst)


def exe_master(product_id,store_id,sp_lst):
    sp = Store_product.objects.get(product_id=product_id,store_id=store_id)
    sp.kit_child_set.clear()

    if len(sp_lst) != 0:
        sp.kit_child_set.add(*sp_lst)


def exe_couch(product_id,store_id,sp_lst):
    sp = store_product_couch_getter.exe(product_id,store_id)
    sp['kit_child_bare_lst'] = [item.product.id for item in sp_lst]
    db = couch_util.get_store_db(store_id)
    db.save(sp)