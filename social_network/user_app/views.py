from django.views.generic.base import TemplateView
# Create your views here.

class UserAppView(TemplateView):
    template_name = "user_app/user.html"
