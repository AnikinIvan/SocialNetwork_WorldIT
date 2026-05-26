from .views import *
from django.urls import path


urlpatterns = [
    path(route="", view=ChatView.as_view(), name = "chat")
]