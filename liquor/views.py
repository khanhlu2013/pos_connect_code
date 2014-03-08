from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext

@login_required
def home_page_view(request):
    if request.user.is_superuser:
        template_name = 'home_super_user.html'
    else:
        template_name = 'home_regular_user.html'
    
    return render_to_response(template_name,{},context_instance=RequestContext(request))
