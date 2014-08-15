from mix_match.models import Mix_match

def get_mix_match_lst(store_id):
    lst =  Mix_match.objects.prefetch_related('sp_lst').filter(store_id=store_id)
    sorted(lst, key=lambda mix_match: mix_match.qty) 
    return lst


def get_mix_match_item(id):
    return Mix_match.objects.prefetch_related('sp_lst').get(pk=id)