from sale_shortcut.models import Parent,Child

def get_shortcut(id):
    return Parent.objects.prefetch_related('child_set').get(pk=id)

def get_shorcut_lst(store_id):
    return Parent.objects.filter(store_id=store_id).prefetch_related('child_set')