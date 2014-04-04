from store_product.models import Store_product
import json

def get_sp(store_id,product_id):
    return Store_product.objects.get(store_id = store_id,product_id=product_id)

def get_lookup_type_tag(store_id):
    result = {}
    type_tag_lst =  Store_product.objects.filter(store_id=store_id).values_list('p_type','p_tag').distinct().order_by('p_type','p_tag')

    for item in type_tag_lst:
        p_type,p_tag = item
        if p_type != None:
            if not p_type in result:
                result[p_type] = [] if p_tag == None else [p_tag,]
            elif p_tag != None:
                result[p_type].append(p_tag)
            
    return result