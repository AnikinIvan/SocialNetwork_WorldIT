from django.views.generic.base import TemplateView
# Create your views here.

class ChatAppView(TemplateView):
    template_name = "chats_app/chats.html"
