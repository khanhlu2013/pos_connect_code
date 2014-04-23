from mix_match.models import Mix_match

def get_mix_match_lst(store_id):
    return Mix_match.objects.prefetch_related('mix_match_child_set').filter(store_id=store_id)


def get_mix_match_item(id):
	return Mix_match.objects.prefetch_related('mix_match_child_set').get(pk=id)