from .views import *
from django.urls import path


urlpatterns = [
    path(route="", view=ChatsPageView.as_view(), name = "chat")
]