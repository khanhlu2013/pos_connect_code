from group.models import Group

def get_group_lst(store_id):
    lst =  Group.objects.filter(store_id=store_id).order_by('name')
    return lst


def get_group_item(id,store_id):
    return Group.objects.prefetch_related('sp_lst').get(pk=id,store_id=store_id)    