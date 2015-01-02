from django.http import HttpResponse
import json
from django.core.serializers.json import DjangoJSONEncoder
from store.models import Store
from store.store_serializer import Store_serializer

def edit(request):
    cur_login_store = request.session.get('cur_login_store')
    store = json.loads(request.POST['store'])

    if cur_login_store.id != store['id']:
        return

    Store.objects.filter(pk=store['id']).update(**store)
    updated_store = Store.objects.get(pk=store['id'])
    request.session['cur_login_store'] = updated_store

    return HttpResponse(json.dumps(Store_serializer(updated_store,many=False).data,cls=DjangoJSONEncoder),content_type='application/json')