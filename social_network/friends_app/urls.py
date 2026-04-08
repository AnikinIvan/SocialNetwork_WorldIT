from django.urls import path
from friends_app.views import FriendsPageView

urlpatterns = [
    path("friends/", FriendsPageView.as_view(), name = 'friends')
]