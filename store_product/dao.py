from store_product.models import Store_product

def by_pid_lst_and_store_id(pid_lst,store_id):
    return list(Store_product.objects.filter(product_id__in=pid_lst).filter(store_id = store_id))

def get_item(product_id,store_id):
    return Store_product.objects.get(product_id=product_id,store_id=store_id)

def get_lst_by_sku(sku,store_id):
    return Store_product.objects.filter(store_id=store_id,product__prodskuassoc__store_product_set__store_id=store_id,product__prodskuassoc__sku__sku=sku)

def get_type_tag_lst(store_id):
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