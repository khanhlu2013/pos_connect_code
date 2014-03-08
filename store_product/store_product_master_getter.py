from store_product.models import Store_product

def by_pid_lst_and_store_id(pid_lst,store_id):
    return list(Store_product.objects.filter(product__id__in=pid_lst).filter(business__id = store_id))
