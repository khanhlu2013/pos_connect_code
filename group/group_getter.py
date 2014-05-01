from group.models import Group

def get_group_lst(store_id):
    lst =  Group.objects.prefetch_related('group_child_set').filter(store_id=store_id)
    return lst


def get_group_item(id):
    return Group.objects.prefetch_related('group_child_set').get(pk=id)