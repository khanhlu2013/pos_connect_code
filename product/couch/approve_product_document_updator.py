from product.couch import approve_product_db_getter
from util.couch import couch_constance
from product.couch import approve_product_document_getter
from store_product.models import Store_product
from product.couch.Approve_product_document import Approve_product_document                          

def exe(product_id,store_id,frequency,assoc_sku_str):
    store_product = Store_product.objects.get(product__id=product_id,business__id=store_id)

    if not store_product.product.is_approve(frequency):
        raise Exception('product is not approve. It should not be added into approve db')

    if not assoc_sku_str in [sku.sku for sku in store_product.product.sku_lst.all()]:
        raise Exception('assoc sku str is not correct')

    doc = approve_product_document_getter.exe(product_id)
    db = approve_product_db_getter.exe()

    if doc == None:
        sku_lst = []
        for prod_sku_assoc in store_product.product.prodskuassoc_set.all():
            if prod_sku_assoc.is_approve(frequency):
                sku_lst.append(prod_sku_assoc.sku.sku)

        doc = Approve_product_document(
             d_type = couch_constance.APPROVE_PRODUCT_DOC_TYPE
            ,product_id = product_id 
            ,name = store_product.name
            ,sku_lst = sku_lst
        )
        doc.store(db)
    else:
        sku_lst = doc['sku_lst']
        if not assoc_sku_str in sku_lst:
            doc['sku_lst'].append(assoc_sku_str)
        db.save(doc)    

