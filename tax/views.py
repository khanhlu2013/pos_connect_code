from django.http import HttpResponse
import json
from django.core.serializers.json import DjangoJSONEncoder

def update_angular(request):
    cur_login_store = request.session.get('cur_login_store')
    tax_rate = request.POST['tax_rate'] 
    cur_login_store.tax_rate = tax_rate
    cur_login_store.save()
    request.session['cur_login_store'] = cur_login_store

    return HttpResponse(json.dumps(str(cur_login_store.tax_rate)),content_type='application/json')


def update(request):
    cur_login_store = request.session.get('cur_login_store')
    tax_rate = request.POST['tax_rate'] 
    cur_login_store.tax_rate = tax_rate
    cur_login_store.save()
    request.session['cur_login_store'] = cur_login_store

    return HttpResponse(json.dumps(cur_login_store.tax_rate,cls=DjangoJSONEncoder),content_type='application/json')

