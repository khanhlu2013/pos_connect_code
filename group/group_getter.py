from group.models import Group

def get_group_lst(store_id):
    lst =  Group.objects.prefetch_related('store_product_set').filter(store_id=store_id).order_by('name')
    return lst


def get_group_item(id):
    return Group.objects.prefetch_related('store_product_set').get(pk=id)