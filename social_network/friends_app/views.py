from django.views.generic import TemplateView

# Create your views here.

class FriendsPageView(TemplateView):
    template_name = "friends_app/friends.html"
