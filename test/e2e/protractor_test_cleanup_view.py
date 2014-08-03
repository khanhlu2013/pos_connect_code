from helper import rf
from django.http import HttpResponse

def exe(request):
	rf.protractor();
	print('--- done with init protractor data ----')
	return HttpResponse('',content_type="application/json")

